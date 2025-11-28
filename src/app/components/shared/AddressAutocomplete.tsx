"use client"
import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "flowbite-react";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (data: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  required = false,
  disabled = false,
}: AddressAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        setIsLoading(true);
        
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        let address = place.formatted_address || value;
        let city = "";
        let state = "";
        let zipCode = "";
        let country = "";

        // Extract address components
        if (place.address_components) {
          place.address_components.forEach((component) => {
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
        }

        // If city is not found, try to get it from other components
        if (!city) {
          const localityComponent = place.address_components?.find((component) =>
            component.types.includes("locality")
          );
          if (localityComponent) {
            city = localityComponent.long_name;
          } else {
            // Try administrative_area_level_2 as fallback
            const adminArea2 = place.address_components?.find((component) =>
              component.types.includes("administrative_area_level_2")
            );
            if (adminArea2) {
              city = adminArea2.long_name;
            }
          }
        }

        // Update the input value
        onChange(address);

        // Call the callback with all the extracted data
        onPlaceSelect({
          address,
          city,
          state,
          zipCode,
          country,
          lat,
          lng,
        });

        setIsLoading(false);
      }
    }
  };

  if (loadError) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          className="form-control"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        <div className="mt-1 text-xs text-error">
          Google Maps API not available. Please check your API key configuration.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          className="form-control"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["address"],
          componentRestrictions: { country: [] }, // Allow all countries, remove if you want to restrict
        }}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          className="form-control"
          placeholder={placeholder}
          required={required}
          disabled={disabled || isLoading}
        />
      </Autocomplete>
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Spinner size="sm" />
        </div>
      )}
      {!isLoading && value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon icon="solar:map-point-bold" className="text-muted text-lg" />
        </div>
      )}
    </div>
  );
}

