import { API_CONFIG } from "@/constants/api"
import type { ApiResponse, ApiResponseV1, ApiResponseV2, NormalizedApiResponse } from "@/types/patient"

export class ApiService {
  private static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private static isApiResponseV1(response: any): response is ApiResponseV1 {
    return (
      response &&
      typeof response === "object" &&
      Array.isArray(response.data) &&
      response.pagination &&
      typeof response.pagination === "object" &&
      typeof response.pagination.page === "number" &&
      typeof response.pagination.limit === "number" &&
      typeof response.pagination.total === "number" &&
      typeof response.pagination.totalPages === "number"
    )
  }

  private static isApiResponseV2(response: any): response is ApiResponseV2 {
    return (
      response &&
      typeof response === "object" &&
      Array.isArray(response.patients) &&
      typeof response.current_page === "number" &&
      typeof response.per_page === "number" &&
      typeof response.total_records === "number"
    )
  }

  private static validateApiResponse(response: any): ApiResponse | null {
    if (this.isApiResponseV1(response)) {
      console.log("Detected API Response V1 format (data + pagination)")
      return response
    }

    if (this.isApiResponseV2(response)) {
      console.log("Detected API Response V2 format (patients + current_page)")
      return response
    }

    console.error("Invalid response: doesn't match any known format", response)
    return null
  }

  private static normalizeApiResponse(response: ApiResponse): NormalizedApiResponse {
    if (this.isApiResponseV1(response)) {
      // Already in the expected format
      return {
        data: response.data,
        pagination: response.pagination,
        metadata: response.metadata,
      }
    } else {
      // Convert V2 format to V1 format
      const totalPages = Math.ceil(response.total_records / response.per_page)
      return {
        data: response.patients,
        pagination: {
          page: response.current_page,
          limit: response.per_page,
          total: response.total_records,
          totalPages,
          hasNext: response.current_page < totalPages,
          hasPrevious: response.current_page > 1,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: "v1.0",
          requestId: Math.random().toString(36).substr(2, 9),
        },
      }
    }
  }

  static async fetchPatientsPage(
    page: number,
    retries = API_CONFIG.MAX_RETRIES,
  ): Promise<NormalizedApiResponse | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const url = `${API_CONFIG.BASE_URL}/patients?page=${page}&limit=${API_CONFIG.DEFAULT_LIMIT}`
        console.log(
          `Fetching page ${page}, attempt ${attempt} (expecting ~${API_CONFIG.DEFAULT_LIMIT} patients per page)`,
        )

        const response = await fetch(url, {
          headers: {
            "x-api-key": API_CONFIG.API_KEY,
          },
        })

        if (response.status === 429) {
          console.log(`Rate limited on page ${page}, retrying with exponential backoff...`)
          // Exponential backoff for rate limiting (as mentioned in API behavior)
          await this.delay(1000 * Math.pow(2, attempt - 1))
          continue
        }

        if (response.status >= 500) {
          console.log(`Server error ${response.status} on page ${page} (simulated ~8% failure rate)`)
          if (attempt < retries) {
            await this.delay(500 * Math.pow(2, attempt - 1)) // Exponential backoff for 5xx errors
            continue
          }
          throw new Error(`Server error: ${response.status}`)
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error(`Failed to parse JSON for page ${page}:`, jsonError)
          throw new Error(`Invalid JSON response from server`)
        }

        console.log(`Raw response for page ${page}:`, JSON.stringify(data, null, 2))

        // Validate the response structure (handles both formats due to inconsistent responses)
        const validatedResponse = this.validateApiResponse(data)
        if (!validatedResponse) {
          throw new Error(`Invalid response structure for page ${page}`)
        }

        // Normalize the response to our internal format
        const normalizedResponse = this.normalizeApiResponse(validatedResponse)

        console.log(`Successfully fetched page ${page} with ${normalizedResponse.data.length} patients`)
        console.log(`Pagination info:`, normalizedResponse.pagination)

        return normalizedResponse
      } catch (err) {
        console.error(`Error fetching page ${page}, attempt ${attempt}:`, err)
        if (attempt === retries) {
          throw err
        }
        // Exponential backoff for retries
        await this.delay(500 * Math.pow(2, attempt - 1))
      }
    }
    return null
  }

  static async fetchAllPatients(onProgress?: (progress: number) => void): Promise<NormalizedApiResponse["data"]> {
    const allPatients: NormalizedApiResponse["data"] = []
    let totalRecordsExpected = 0
    let pagesSuccessfullyFetched = 0

    try {
      console.log("Starting to fetch all patients (expecting ~10 pages, ~50 patients total)...")
      const firstPageResponse = await this.fetchPatientsPage(1)

      if (!firstPageResponse) {
        throw new Error("Failed to fetch first page of patient data after all retries.")
      }

      if (!firstPageResponse.data || !Array.isArray(firstPageResponse.data)) {
        console.error("First page response data is invalid:", firstPageResponse)
        throw new Error("Invalid data structure in first page response")
      }

      allPatients.push(...firstPageResponse.data)
      pagesSuccessfullyFetched++
      const totalPages = firstPageResponse.pagination.totalPages
      totalRecordsExpected = firstPageResponse.pagination.total // Store total expected records
      onProgress?.((1 / totalPages) * 100)

      console.log(`Total pages to fetch: ${totalPages} (${totalRecordsExpected} total patients expected)`)
      console.log(`First page contained ${firstPageResponse.data.length} patients`)

      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          try {
            const response = await this.fetchPatientsPage(page)
            if (response && response.data && Array.isArray(response.data)) {
              allPatients.push(...response.data)
              pagesSuccessfullyFetched++
              console.log(`Added ${response.data.length} patients from page ${page}`)
            } else {
              console.warn(
                `Page ${page} returned invalid or empty data (inconsistent response format or failed to retrieve after retries). Skipping this page.`,
              )
            }
            onProgress?.((page / totalPages) * 100)

            await this.delay(200) // Small delay to avoid rate limiting
          } catch (pageError) {
            console.error(`Failed to fetch page ${page} after all retries (handling intermittent failures):`, pageError)
            // Continue with other pages even if one fails, but log the failure
            continue
          }
        }
      }

      console.log(
        `Fetch complete. Successfully fetched ${allPatients.length} patients from ${pagesSuccessfullyFetched} pages. Expected total: ${totalRecordsExpected}`,
      )

      if (allPatients.length === 0) {
        throw new Error("No patient data was retrieved from the API.")
      } else if (allPatients.length < totalRecordsExpected) {
        console.warn(
          `Warning: Fetched ${allPatients.length} patients, but expected ${totalRecordsExpected}. Some data might be missing due to API intermittent failures or skipped pages.`,
        )
      }

      return allPatients
    } catch (error) {
      console.error("Error in fetchAllPatients:", error)
      throw error
    }
  }
}
