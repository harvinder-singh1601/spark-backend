"use client"
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface GoogleMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  readOnly?: boolean;
  onLocationChange: (data: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) => void;
}

export default function GoogleMapPicker({
  initialLat,
  initialLng,
  readOnly = false,
  onLocationChange,
}: GoogleMapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(() => {
    if (initialLat && initialLng) {
      return { lat: initialLat, lng: initialLng };
    }
    return { lat: 40.7128, lng: -74.0060 }; // Default to New York
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (initialLat && initialLng) {
      setMarkerPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsGeocoding(true);
      try {
        const response = await fetch(
          `/api/reverse-geocode?lat=${lat}&lng=${lng}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          let address = result.formatted_address;
          let city = "";
          let state = "";
          let zipCode = "";
          let country = "";

          addressComponents.forEach((component: any) => {
            const types = component.types;
            if (types.includes("locality")) {
              city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
              state = component.short_name;
            } else if (types.includes("postal_code")) {
              zipCode = component.long_name;
            } else if (types.includes("country")) {
              country = component.short_name;
            }
          });

          onLocationChange({
            lat,
            lng,
            address,
            city,
            state,
            zipCode,
            country,
          });
        } else {
          onLocationChange({ lat, lng });
        }
      } catch (error) {
        onLocationChange({ lat, lng });
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationChange]
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        reverseGeocode(lat, lng);
      }
    },
    [reverseGeocode]
  );

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        reverseGeocode(lat, lng);
      }
    },
    [reverseGeocode]
  );

  if (loadError) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center border border-border rounded-md bg-gray-50">
        <div className="text-center">
          <p className="text-error mb-2">Error loading Google Maps</p>
          <p className="text-sm text-muted">
            Please check your API key configuration
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center border border-border rounded-md bg-gray-50">
        <Spinner size="xl" />
        <span className="ml-3 text-muted">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full h-[500px] border border-border rounded-md overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={markerPosition}
          zoom={markerPosition.lat === 40.7128 && markerPosition.lng === -74.0060 ? 10 : 15}
          onClick={readOnly ? undefined : handleMapClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker
            position={markerPosition}
            draggable={!readOnly}
            onDragEnd={readOnly ? undefined : handleMarkerDragEnd}
          />
        </GoogleMap>
      </div>
      {isGeocoding && (
        <div className="absolute top-2 right-2 bg-white px-3 py-2 rounded-md shadow-md flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm">Fetching address...</span>
        </div>
      )}
      <div className="mt-2 text-sm text-muted">
        Coordinates: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
      </div>
    </div>
  );
}

