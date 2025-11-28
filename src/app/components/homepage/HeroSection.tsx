"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressAutocomplete from "../shared/AddressAutocomplete";
import GoogleMapsProvider from "../shared/GoogleMapsProvider";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function HeroSection() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleAddressSelect = (data: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    lat: number;
    lng: number;
  }) => {
    setAddress(data.address);
    router.push(`/locations/nearby?lat=${data.lat}&lng=${data.lng}&address=${encodeURIComponent(data.address)}`);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/locations/nearby?lat=${latitude}&lng=${longitude}`);
        setIsLoadingLocation(false);
      },
      (error) => {
        alert("Unable to get your location. Please enter an address manually.");
        setIsLoadingLocation(false);
      }
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      router.push(`/locations/nearby?address=${encodeURIComponent(address)}`);
    }
  };

  return (
    <GoogleMapsProvider>
      <section className="relative min-h-[600px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            spark
            <span className="block text-sm font-normal uppercase tracking-wider mt-1">
              DELIVERY
            </span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Order online. Get it delivered
          </h2>

          {/* Address Input Form */}
          <form onSubmit={handleAddressSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
              <div className="flex-1 w-full">
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  onPlaceSelect={handleAddressSelect}
                  placeholder="ENTER AN ADDRESS OR CITY"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center min-w-[120px]"
              >
                <Icon icon="solar:arrow-right-bold" width={24} height={24} />
              </button>
            </div>

            {/* Use My Location */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLoadingLocation}
              className="mt-4 text-sm flex items-center gap-2 mx-auto hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              {isLoadingLocation ? (
                <>
                  <Icon icon="svg-spinners:ring-resize" width={18} height={18} />
                  <span>Getting location...</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:map-point-bold" width={18} height={18} />
                  <span>Use my location</span>
                </>
              )}
            </button>
          </form>

          {/* Informational Text */}
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6">
            Spark Rewards brings you 10+ best cannabis brands across Canada. 
            We serve friends looking for their next favourite strain.
          </p>

          {/* Alternative Option */}
          <p className="text-sm uppercase tracking-wider text-gray-400">
            OR PICK UP AT THE STORE
          </p>
        </div>
      </div>
    </section>
    </GoogleMapsProvider>
  );
}

