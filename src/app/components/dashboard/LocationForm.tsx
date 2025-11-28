"use client"
import { Button, Label, Select, Spinner, Textarea, TextInput } from "flowbite-react"
import { useEffect, useReducer, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import GoogleMapPicker from "../shared/GoogleMapPicker";
import AddressAutocomplete from "../shared/AddressAutocomplete";
import CardBox from "../shared/CardBox";
import GoogleMapsProvider from "../shared/GoogleMapsProvider";
import { useRouter } from "next/navigation";

export default function LocationForm({ activeLocation, mode }: any) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  
  const initialLocationInfo = isEditMode && activeLocation ? {
    shopName: activeLocation.shopName || "",
    banners: activeLocation.banners || [],
    ownerName: activeLocation.ownerName || "",
    ownerEmail: activeLocation.ownerEmail || "",
    ownerPhone: activeLocation.ownerPhone || "",
    address: activeLocation.address || "",
    city: activeLocation.city || "",
    state: activeLocation.state || "",
    zipCode: activeLocation.zipCode || "",
    country: activeLocation.country || "USA",
    lat: activeLocation.lat || 40.7128,
    lng: activeLocation.lng || -74.0060,
    status: activeLocation.status || "active",
    description: activeLocation.description || "",
    posId: activeLocation.posId || "",
    websiteUrl: activeLocation.websiteUrl || "",
  } : {
    shopName: "",
    banners: [],
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    lat: 40.7128,
    lng: -74.0060,
    status: "active",
    description: "",
    posId: "",
    websiteUrl: "",
  };

  function reducer(locationInfo: any, action: { type: string, payload?: any }) {
    switch (action.type) {
      case "SET_SHOP_NAME":
        return { ...locationInfo, shopName: action.payload };
      case "SET_BANNERS":
        return { ...locationInfo, banners: action.payload };
      case "SET_OWNER_NAME":
        return { ...locationInfo, ownerName: action.payload };
      case "SET_OWNER_EMAIL":
        return { ...locationInfo, ownerEmail: action.payload };
      case "SET_OWNER_PHONE":
        return { ...locationInfo, ownerPhone: action.payload };
      case "SET_ADDRESS":
        return { ...locationInfo, address: action.payload };
      case "SET_CITY":
        return { ...locationInfo, city: action.payload };
      case "SET_STATE":
        return { ...locationInfo, state: action.payload };
      case "SET_ZIP_CODE":
        return { ...locationInfo, zipCode: action.payload };
      case "SET_COUNTRY":
        return { ...locationInfo, country: action.payload };
      case "SET_LAT":
        return { ...locationInfo, lat: action.payload };
      case "SET_LNG":
        return { ...locationInfo, lng: action.payload };
      case "SET_LOCATION":
        return {
          ...locationInfo,
          lat: action.payload.lat,
          lng: action.payload.lng,
          address: action.payload.address || locationInfo.address,
          city: action.payload.city || locationInfo.city,
          state: action.payload.state || locationInfo.state,
          zipCode: action.payload.zipCode || locationInfo.zipCode,
          country: action.payload.country || locationInfo.country,
        };
      case "SET_STATUS":
        return { ...locationInfo, status: action.payload };
      case "SET_DESCRIPTION":
        return { ...locationInfo, description: action.payload };
      case "SET_POS_ID":
        return { ...locationInfo, posId: action.payload };
      case "SET_WEBSITE_URL":
        return { ...locationInfo, websiteUrl: action.payload };
      case "RESET":
        return initialLocationInfo;
      default:
        return locationInfo;
    }
  }

  const [locationInfo, dispatch] = useReducer(reducer, initialLocationInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerInput, setBannerInput] = useState("");

  useEffect(() => {
    if (isEditMode && activeLocation) {
      dispatch({ type: "SET_SHOP_NAME", payload: activeLocation.shopName || "" });
      dispatch({ type: "SET_BANNERS", payload: activeLocation.banners || [] });
      dispatch({ type: "SET_OWNER_NAME", payload: activeLocation.ownerName || "" });
      dispatch({ type: "SET_OWNER_EMAIL", payload: activeLocation.ownerEmail || "" });
      dispatch({ type: "SET_OWNER_PHONE", payload: activeLocation.ownerPhone || "" });
      dispatch({ type: "SET_ADDRESS", payload: activeLocation.address || "" });
      dispatch({ type: "SET_CITY", payload: activeLocation.city || "" });
      dispatch({ type: "SET_STATE", payload: activeLocation.state || "" });
      dispatch({ type: "SET_ZIP_CODE", payload: activeLocation.zipCode || "" });
      dispatch({ type: "SET_COUNTRY", payload: activeLocation.country || "USA" });
      dispatch({ type: "SET_LAT", payload: activeLocation.lat || 40.7128 });
      dispatch({ type: "SET_LNG", payload: activeLocation.lng || -74.0060 });
      dispatch({ type: "SET_STATUS", payload: activeLocation.status || "active" });
      dispatch({ type: "SET_DESCRIPTION", payload: activeLocation.description || "" });
      dispatch({ type: "SET_POS_ID", payload: activeLocation.posId || "" });
      dispatch({ type: "SET_WEBSITE_URL", payload: activeLocation.websiteUrl || "" });
      setBannerInput("");
    } else {
      dispatch({ type: "RESET" });
      setBannerInput("");
    }
  }, [activeLocation, isEditMode]);

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleAddBanner = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    e.preventDefault();
    const trimmedBanner = bannerInput.trim();
    if (!trimmedBanner) {
      return;
    }
    
    if (!isValidUrl(trimmedBanner)) {
      toast.error("Please enter a valid URL (must start with http:// or https://)", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        className: "!font-semibold !font-inherit !text-[#EF4444]",
      });
      return;
    }
    
    if (!locationInfo.banners.includes(trimmedBanner)) {
      dispatch({ type: "SET_BANNERS", payload: [...locationInfo.banners, trimmedBanner] });
      setBannerInput("");
    } else {
      toast.warning("This banner URL is already added", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        className: "!font-semibold !font-inherit !text-[#FF9800]",
      });
    }
  };

  const handleRemoveBanner = (bannerToRemove: string) => {
    dispatch({ type: "SET_BANNERS", payload: locationInfo.banners.filter((banner: string) => banner !== bannerToRemove) });
  };

  const handleLocationChange = (data: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) => {
    dispatch({ type: "SET_LOCATION", payload: data });
  };

  const handleAddressSelect = (data: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    lat: number;
    lng: number;
  }) => {
    // Update all fields from the selected address
    dispatch({ type: "SET_ADDRESS", payload: data.address });
    if (data.city) {
      dispatch({ type: "SET_CITY", payload: data.city });
    }
    if (data.state) {
      dispatch({ type: "SET_STATE", payload: data.state });
    }
    if (data.zipCode) {
      dispatch({ type: "SET_ZIP_CODE", payload: data.zipCode });
    }
    if (data.country) {
      dispatch({ type: "SET_COUNTRY", payload: data.country });
    }
    // Update map location
    dispatch({ type: "SET_LAT", payload: data.lat });
    dispatch({ type: "SET_LNG", payload: data.lng });
  };

  async function handleSubmit() {
    if (
      !locationInfo.shopName ||
      !locationInfo.ownerName ||
      !locationInfo.ownerEmail ||
      !locationInfo.address ||
      !locationInfo.city
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        className: "!font-semibold !font-inherit !text-[#EF4444]",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        shopName: locationInfo.shopName,
        banners: locationInfo.banners || [],
        ownerName: locationInfo.ownerName,
        ownerEmail: locationInfo.ownerEmail,
        ownerPhone: locationInfo.ownerPhone?.trim() || null,
        address: locationInfo.address,
        city: locationInfo.city,
        state: locationInfo.state || null,
        zipCode: locationInfo.zipCode || null,
        country: locationInfo.country || "USA",
        lat: locationInfo.lat,
        lng: locationInfo.lng,
        status: locationInfo.status || "active",
        description: locationInfo.description || null,
        posId: locationInfo.posId || null,
        websiteUrl: locationInfo.websiteUrl || null,
      };

      const url = isEditMode ? `/api/store/${activeLocation.id}` : "/api/store";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`Store ${isEditMode ? 'updated' : 'created'} successfully!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          className: "!font-semibold !font-inherit !text-[#00C853]",
        });
        router.push("/admin/locations");
      } else {
        const result = await response.json();
        toast.error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} store`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          className: "!font-semibold !font-inherit !text-[#EF4444]",
        });
      }
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} store`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        className: "!font-semibold !font-inherit !text-[#EF4444]",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GoogleMapsProvider>
    <CardBox>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h5 className="card-title">{isEditMode ? "Edit Store" : "Add New Store"}</h5>
          <Button
            onClick={() => router.push("/locations")}
            color="light"
            className="flex items-center gap-2"
          >
            <Icon icon="solar:arrow-left-outline" width={18} height={18} />
            Back
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Map */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Label className="font-medium mb-2 block">
                Select Store Location on Map
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <GoogleMapPicker
                initialLat={locationInfo.lat}
                initialLng={locationInfo.lng}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <Label htmlFor="shopName" value="Shop Name" className="font-medium" />
              <span className="text-red-500 ml-1">*</span>
              <TextInput
                id="shopName"
                value={locationInfo.shopName}
                onChange={(e) => dispatch({ type: "SET_SHOP_NAME", payload: e.target.value })}
                type="text"
                className="form-control mt-2"
                placeholder="Enter shop name"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" value="Address" className="font-medium" />
              <span className="text-red-500 ml-1">*</span>
              <div className="mt-2">
                <AddressAutocomplete
                  value={locationInfo.address}
                  onChange={(value) => dispatch({ type: "SET_ADDRESS", payload: value })}
                  onPlaceSelect={handleAddressSelect}
                  placeholder="Start typing address..."
                  required
                />
              </div>
              <p className="text-xs text-muted mt-1">
                Start typing to see address suggestions from Google Maps
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" value="City" className="font-medium" />
                <span className="text-red-500 ml-1">*</span>
                <TextInput
                  id="city"
                  value={locationInfo.city}
                  onChange={(e) => dispatch({ type: "SET_CITY", payload: e.target.value })}
                  type="text"
                  className="form-control mt-2"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" value="State" className="font-medium" />
                <TextInput
                  id="state"
                  value={locationInfo.state}
                  onChange={(e) => dispatch({ type: "SET_STATE", payload: e.target.value })}
                  type="text"
                  className="form-control mt-2"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode" value="Zip Code" className="font-medium" />
                <TextInput
                  id="zipCode"
                  value={locationInfo.zipCode}
                  onChange={(e) => dispatch({ type: "SET_ZIP_CODE", payload: e.target.value })}
                  type="text"
                  className="form-control mt-2"
                  placeholder="Zip Code"
                />
              </div>
              <div>
                <Label htmlFor="country" value="Country" className="font-medium" />
                <TextInput
                  id="country"
                  value={locationInfo.country}
                  onChange={(e) => dispatch({ type: "SET_COUNTRY", payload: e.target.value })}
                  type="text"
                  className="form-control mt-2"
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat" value="Latitude" className="font-medium" />
                <TextInput
                  id="lat"
                  value={locationInfo.lat}
                  type="text"
                  className="form-control mt-2"
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="lng" value="Longitude" className="font-medium" />
                <TextInput
                  id="lng"
                  value={locationInfo.lng}
                  type="text"
                  className="form-control mt-2"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="border-t border-border pt-6">
          <h6 className="text-lg font-semibold mb-4">Owner Information</h6>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ownerName" value="Owner Name" className="font-medium" />
              <span className="text-red-500 ml-1">*</span>
              <TextInput
                id="ownerName"
                value={locationInfo.ownerName}
                onChange={(e) => dispatch({ type: "SET_OWNER_NAME", payload: e.target.value })}
                type="text"
                className="form-control mt-2"
                placeholder="Owner name"
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerEmail" value="Owner Email" className="font-medium" />
              <span className="text-red-500 ml-1">*</span>
              <TextInput
                id="ownerEmail"
                value={locationInfo.ownerEmail}
                onChange={(e) => dispatch({ type: "SET_OWNER_EMAIL", payload: e.target.value })}
                type="email"
                className="form-control mt-2"
                placeholder="owner@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="ownerPhone" value="Owner Phone" className="font-medium" />
              <TextInput
                id="ownerPhone"
                value={locationInfo.ownerPhone}
                onChange={(e) => dispatch({ type: "SET_OWNER_PHONE", payload: e.target.value })}
                type="tel"
                className="form-control mt-2"
                placeholder="+1-555-0100"
              />
            </div>
          </div>
        </div>

        {/* Banners */}
        <div className="border-t border-border pt-6">
          <Label className="font-medium mb-2 block">Banner Images</Label>
          <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md min-h-[42px] items-center">
            {locationInfo.banners && locationInfo.banners.length > 0 ? (
              locationInfo.banners.map((banner: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  <span className="max-w-[200px] truncate">{banner}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(banner)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <Icon icon="solar:close-circle-bold" width={16} height={16} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted text-sm">No banners added yet</span>
            )}
          </div>
          <div className="flex gap-2">
            <TextInput
              id="banners"
              value={bannerInput}
              onChange={(e) => setBannerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddBanner(e);
                }
              }}
              type="text"
              className="form-control flex-1"
              placeholder="Enter banner image URL and press Enter"
            />
            <Button
              type="button"
              onClick={handleAddBanner}
              color="primary"
              className="px-4"
            >
              Add
            </Button>
          </div>
        </div>

        {/* POS ID and Website URL */}
        <div className="border-t border-border pt-6">
          <h6 className="text-lg font-semibold mb-4">Store Information</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="posId" value="POS ID" className="font-medium" />
              <TextInput
                id="posId"
                value={locationInfo.posId}
                onChange={(e) => dispatch({ type: "SET_POS_ID", payload: e.target.value })}
                type="text"
                className="form-control mt-2"
                placeholder="Enter POS ID"
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl" value="Website URL" className="font-medium" />
              <TextInput
                id="websiteUrl"
                value={locationInfo.websiteUrl}
                onChange={(e) => dispatch({ type: "SET_WEBSITE_URL", payload: e.target.value })}
                type="url"
                className="form-control mt-2"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Status and Description */}
        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status" value="Status" className="font-medium mb-2 block" />
              <Select
                id="status"
                value={locationInfo.status}
                onChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value })}
                className="form-control"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" value="Description" className="font-medium mb-2 block" />
              <Textarea
                id="description"
                value={locationInfo.description}
                onChange={(e) => dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })}
                className="form-control"
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading}
            color="primary"
            className="flex items-center gap-2 disabled:hover:bg-none"
          >
            {isLoading ? <Spinner aria-label="Loading spinner" size="sm" /> : null}
            {isEditMode ? "Update Store" : "Create Store"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/locations")}
            disabled={isLoading}
            color="light"
            className="flex items-center gap-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </CardBox>
    </GoogleMapsProvider>
  );
}

