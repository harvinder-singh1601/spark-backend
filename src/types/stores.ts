/**
 * TypeScript types for Public Stores API
 */

// Opening times for a single day
export interface DayOpeningTime {
  open: string;  // 24-hour format (HH:mm)
  close: string; // 24-hour format (HH:mm)
}

// Opening times for all days of the week
export interface OpeningTimes {
  monday?: DayOpeningTime;
  tuesday?: DayOpeningTime;
  wednesday?: DayOpeningTime;
  thursday?: DayOpeningTime;
  friday?: DayOpeningTime;
  saturday?: DayOpeningTime;
  sunday?: DayOpeningTime;
}

// Store object returned by the API
export interface Store {
  id: string;
  shopName: string;
  banners: string[];
  address: string;
  city: string;
  state: string | null;
  zipCode: string | null;
  country: string;
  lat: number;
  lng: number;
  openingTimes: OpeningTimes;
  status: 'active' | 'inactive' | 'closed';
  description: string | null;
  posId?: string | null;      // POS ID from spreadsheet (separated from description)
  websiteUrl?: string | null; // Website URL from spreadsheet (separated from description)
  ownerPhone?: string | null; // Owner phone number (only included if present and not placeholder)
  distance?: number; // Only present in proximity search results (in km)
}

// Pagination metadata
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Proximity filter (when using lat/lng search)
export interface ProximityFilter {
  lat: number;
  lng: number;
  radius: number;
}

// Active filters
export interface ActiveFilters {
  status: string;
  city: string | null;
  state: string | null;
  country: string | null;
  proximity: ProximityFilter | null;
}

// Success response from the API
export interface StoresResponse {
  success: true;
  data: Store[];
  pagination: Pagination;
  filters: ActiveFilters;
}

// Error response from the API
export interface StoresErrorResponse {
  success: false;
  error: string;
  message: string;
}

// Query parameters for the API request
export interface StoresQueryParams {
  status?: 'active' | 'inactive' | 'closed';
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'createDate' | 'shopName' | 'city';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Helper function to build query string from parameters
 */
export function buildStoreQueryString(params: StoresQueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}

/**
 * Helper function to fetch stores from the API
 */
export async function fetchStores(
  params: StoresQueryParams = {}
): Promise<StoresResponse> {
  const queryString = buildStoreQueryString(params);
  const url = `/api/public/stores${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch stores');
  }
  
  return data;
}

/**
 * Helper function to check if a store is currently open
 */
export function isStoreOpen(openingTimes: OpeningTimes, date: Date = new Date()): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[date.getDay()] as keyof OpeningTimes;
  const daySchedule = openingTimes[currentDay];
  
  if (!daySchedule) {
    return false; // Closed if no schedule for the day
  }
  
  const currentTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  return currentTime >= daySchedule.open && currentTime <= daySchedule.close;
}

/**
 * Helper function to format opening hours for display
 */
export function formatOpeningHours(time: DayOpeningTime): string {
  return `${formatTime(time.open)} - ${formatTime(time.close)}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

