/**
 * TypeScript types for Public Locations API (Cities/Areas Served)
 */

// Location (City/Area) object returned by the API
export interface Location {
  id: string;
  city: string;
  provinceAbbv: string; // Province/State abbreviation (e.g., "CA", "NY", "ON")
  slug: string; // SEO-friendly URL slug
  htmlContent: string; // HTML content for SEO page
  images: string[]; // Array of image URLs for the location page
  createDate: string; // ISO 8601 format
  updateDate: string; // ISO 8601 format
}

// Pagination metadata
export interface LocationPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}


// Active filters
export interface LocationActiveFilters {
  city: string | null;
  provinceAbbv: string | null;
  slug: string | null;
}

// Success response from the API
export interface LocationsResponse {
  success: true;
  data: Location[];
  pagination: LocationPagination;
  filters: LocationActiveFilters;
}

// Error response from the API
export interface LocationsErrorResponse {
  success: false;
  error: string;
  message: string;
}

// Query parameters for the API request
export interface LocationsQueryParams {
  city?: string;
  provinceAbbv?: string;
  slug?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'city' | 'provinceAbbv' | 'slug' | 'createDate';
  sortOrder?: 'asc' | 'desc';
}

// Grouped locations (useful for display)
export interface GroupedLocations {
  [provinceAbbv: string]: Location[];
}

/**
 * Helper function to build query string from parameters
 */
export function buildLocationQueryString(params: LocationsQueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}

/**
 * Helper function to fetch locations from the API
 */
export async function fetchLocations(
  params: LocationsQueryParams = {}
): Promise<LocationsResponse> {
  const queryString = buildLocationQueryString(params);
  const url = `/api/public/locations${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch locations');
  }
  
  return data;
}

/**
 * Helper function to group locations by province
 */
export function groupByProvince(locations: Location[]): GroupedLocations {
  return locations.reduce((acc, location) => {
    const provinceAbbv = location.provinceAbbv;
    if (!acc[provinceAbbv]) {
      acc[provinceAbbv] = [];
    }
    acc[provinceAbbv].push(location);
    return acc;
  }, {} as GroupedLocations);
}

/**
 * Helper function to get unique cities from locations
 */
export function getUniqueCities(locations: Location[]): string[] {
  return Array.from(new Set(locations.map(loc => loc.city))).sort();
}

/**
 * Helper function to get unique provinces from locations
 */
export function getUniqueProvinces(locations: Location[]): string[] {
  return Array.from(new Set(locations.map(loc => loc.provinceAbbv))).sort();
}

/**
 * Helper function to format location for display
 */
export function formatLocationDisplay(location: Location): string {
  return `${location.city}, ${location.provinceAbbv}`;
}

/**
 * React Hook for using locations
 */
export interface UseLocationsOptions extends LocationsQueryParams {
  autoFetch?: boolean;
}

export interface UseLocationsReturn {
  locations: Location[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination: LocationPagination | null;
  filters: LocationActiveFilters | null;
}

