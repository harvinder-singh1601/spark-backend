"use client"
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { config } from "@/config/constants";

interface Store {
  id: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lat: number;
  lng: number;
  distance?: number;
  openingTimes?: any;
  status: string;
  description?: string;
}

interface FetchResult {
  stores: Store[];
  radiusUsed: number;
  totalChecked: number;
}

function NearbyLocationsContent() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const address = searchParams.get("address");
  const type = searchParams.get("type") || "delivery";

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radiusUsed, setRadiusUsed] = useState<number>(0);
  const [searchAttempts, setSearchAttempts] = useState<number>(0);

  useEffect(() => {
    async function fetchNearbyStores() {
      if (!lat || !lng) {
        setError("Location coordinates are required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await fetchWithProgressiveRadius(
          parseFloat(lat),
          parseFloat(lng)
        );

        setStores(result.stores);
        setRadiusUsed(result.radiusUsed);
        setSearchAttempts(result.totalChecked);
        
        if (result.stores.length === 0) {
          setError("No stores found in your area. We're working on expanding our service coverage!");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch nearby stores");
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyStores();
  }, [lat, lng]);

  async function fetchWithProgressiveRadius(
    latitude: number,
    longitude: number
  ): Promise<FetchResult> {
    const radii = config.search.radiusSteps;
    let allAttempts = 0;

    for (const radius of radii) {
      allAttempts++;
      
      try {
        const response = await fetch(
          `${config.api.baseUrl}/public/stores?lat=${latitude}&lng=${longitude}&radius=${radius}&status=active&limit=${config.pagination.defaultLimit}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stores: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          return {
            stores: data.data,
            radiusUsed: radius,
            totalChecked: allAttempts,
          };
        }
      } catch (err) {
      }
    }
    return {
      stores: [],
      radiusUsed: radii[radii.length - 1],
      totalChecked: allAttempts,
    };
  }

  function formatOpeningHours(openingTimes: any): string {
    if (!openingTimes) return "Hours not available";
    
    try {
      const times = typeof openingTimes === 'string' ? JSON.parse(openingTimes) : openingTimes;
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayHours = times[today];
      
      if (todayHours && todayHours.open && todayHours.close) {
        return `Open today: ${todayHours.open} - ${todayHours.close}`;
      }
      return "Hours not available";
    } catch {
      return "Hours not available";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-darkgray sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-primary transition-colors">
              spark <span className="text-xs sm:text-sm uppercase">DELIVERY</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Icon icon="solar:arrow-left-outline" width={18} height={18} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Nearby Stores
            </h1>
            
            {address && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-2">
                Near: <span className="font-semibold text-gray-900 dark:text-white">{address}</span>
              </p>
            )}

            {type && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <Icon icon={type === "delivery" ? "solar:delivery-bold" : "solar:shop-bold"} width={18} height={18} />
                {type.charAt(0).toUpperCase() + type.slice(1)} Service
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Searching for stores near you...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Expanding search radius if needed
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 text-center">
              <Icon icon="solar:danger-circle-bold" width={48} height={48} className="mx-auto mb-3 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {stores.length === 0 ? "No Stores Found" : "Error"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Icon icon="solar:home-bold" width={18} height={18} />
                Return to Home
              </Link>
            </div>
          )}

          {/* Success State - Stores List */}
          {!loading && !error && stores.length > 0 && (
            <>
              {/* Info Banner */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:check-circle-bold" width={24} height={24} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      Found <span className="font-bold">{stores.length}</span> store{stores.length !== 1 ? 's' : ''} within{' '}
                      <span className="font-bold">{radiusUsed} km</span> of your location.
                      {searchAttempts > 1 && (
                        <span className="text-gray-600 dark:text-gray-300">
                          {' '}(Expanded search radius {searchAttempts} time{searchAttempts !== 1 ? 's' : ''})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stores Grid */}
              <div className="grid gap-4 sm:gap-6">
                {stores.map((store, index) => (
                  <div
                    key={store.id}
                    className="bg-white dark:bg-darkgray rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                              {store.shopName}
                            </h3>
                            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-start gap-1.5">
                                <Icon icon="solar:map-point-bold" width={16} height={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                <span>{store.address}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Icon icon="solar:city-bold" width={16} height={16} className="text-gray-400 flex-shrink-0" />
                                <span>{store.city}, {store.state} {store.zipCode}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Icon icon="solar:clock-circle-bold" width={16} height={16} className="text-gray-400 flex-shrink-0" />
                                <span>{formatOpeningHours(store.openingTimes)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Distance Badge */}
                      {store.distance !== undefined && (
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <Icon icon="solar:routing-2-bold" width={16} height={16} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                              {store.distance.toFixed(1)} km
                            </span>
                          </div>
                          {index === 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Closest
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Store Description */}
                    {store.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {store.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        <Icon icon="solar:map-arrow-right-bold" width={18} height={18} />
                        Get Directions
                      </a>
                      <Link
                        href={`/store/${store.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        <Icon icon="solar:shop-bold" width={18} height={18} />
                        Store Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <Icon icon="solar:arrow-left-outline" width={18} height={18} />
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NearbyLocationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    }>
      <NearbyLocationsContent />
    </Suspense>
  );
}
