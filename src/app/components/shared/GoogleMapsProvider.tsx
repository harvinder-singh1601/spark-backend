"use client"
import { useLoadScript } from "@react-google-maps/api";
import { createContext, useContext, ReactNode } from "react";
import { Spinner } from "flowbite-react";

const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function GoogleMapsProvider({ children, fallback }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-4 border border-border rounded-md bg-gray-50">
        <div className="text-center">
          <p className="text-error mb-2">Error loading Google Maps</p>
          <p className="text-sm text-muted">
            {apiKey ? "Please check your API key configuration" : "Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <Spinner size="md" />
        <span className="ml-3 text-muted">Loading Google Maps...</span>
      </div>
    );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

