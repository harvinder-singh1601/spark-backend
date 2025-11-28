"use client"
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Label, Badge } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "@/app/components/shared/CardBox";
import GoogleMapPicker from "@/app/components/shared/GoogleMapPicker";
import GoogleMapsProvider from "@/app/components/shared/GoogleMapsProvider";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id as string;
        const response = await fetch(`/api/store/${id}`);
        const result = await response.json();
        if (result.data) {
          setLocation(result.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [params]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <span className="ml-3 text-muted">Loading store...</span>
      </div>
    );
  }

  if (!location) {
    return (
      <CardBox>
        <div className="text-center py-8">
          <p className="text-error">Store not found</p>
          <Button onClick={() => router.push("/locations")} color="primary" className="mt-4">
            Back to Stores
          </Button>
        </div>
      </CardBox>
    );
  }

  return (
    <>
      <CardBox>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h5 className="card-title">{location.shopName}</h5>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/locations/${location.id}/edit`)}
                color="primary"
                className="flex items-center gap-2"
              >
                <Icon icon="fluent:edit-16-regular" width={18} height={18} />
                Edit
              </Button>
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
        </div>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Label className="font-medium">Status:</Label>
            <Badge
              color={
                location.status === "active" ? "success" :
                location.status === "inactive" ? "warning" : "error"
              }
              size="sm"
              className="text-[13px] px-3 rounded-full"
            >
              {location.status}
            </Badge>
          </div>

          {/* Map */}
          <div>
            <Label className="font-medium mb-2 block">Store Location on Map</Label>
            <GoogleMapsProvider>
              <GoogleMapPicker
                initialLat={location.lat}
                initialLng={location.lng}
                readOnly={true}
                onLocationChange={() => {}}
              />
            </GoogleMapsProvider>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Address:</Label>
              <p className="text-sm text-bodytext mt-1">{location.address}</p>
            </div>
            <div>
              <Label className="font-medium">City:</Label>
              <p className="text-sm text-bodytext mt-1">{location.city}</p>
            </div>
            {location.state && (
              <div>
                <Label className="font-medium">State:</Label>
                <p className="text-sm text-bodytext mt-1">{location.state}</p>
              </div>
            )}
            {location.zipCode && (
              <div>
                <Label className="font-medium">Zip Code:</Label>
                <p className="text-sm text-bodytext mt-1">{location.zipCode}</p>
              </div>
            )}
            <div>
              <Label className="font-medium">Country:</Label>
              <p className="text-sm text-bodytext mt-1">{location.country}</p>
            </div>
            <div>
              <Label className="font-medium">Coordinates:</Label>
              <p className="text-sm text-bodytext mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="border-t border-border pt-6">
            <h6 className="text-lg font-semibold mb-4">Owner Information</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="font-medium">Owner Name:</Label>
                <p className="text-sm text-bodytext mt-1">{location.ownerName}</p>
              </div>
              <div>
                <Label className="font-medium">Email:</Label>
                <p className="text-sm text-bodytext mt-1">{location.ownerEmail}</p>
              </div>
              {location.ownerPhone && location.ownerPhone !== '+1-000-000-0000' && (
                <div>
                  <Label className="font-medium">Phone:</Label>
                  <p className="text-sm text-bodytext mt-1">{location.ownerPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Banners */}
          {location.banners && location.banners.length > 0 && (
            <div className="border-t border-border pt-6">
              <Label className="font-medium mb-2 block">Banner Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {location.banners
                  .filter((banner: string) => {
                    // Filter out non-URL strings
                    try {
                      const url = new URL(banner);
                      return url.protocol === 'http:' || url.protocol === 'https:';
                    } catch {
                      return false;
                    }
                  })
                  .map((banner: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-md overflow-hidden border border-border">
                      <img
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/products/empty-shopping-bag.gif";
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}


          {/* POS ID and Website URL */}
          {(location.posId || location.websiteUrl) && (
            <div className="border-t border-border pt-6">
              <h6 className="text-lg font-semibold mb-4">Store Information</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.posId && (
                  <div>
                    <Label className="font-medium">POS ID:</Label>
                    <p className="text-sm text-bodytext mt-1">{location.posId}</p>
                  </div>
                )}
                {location.websiteUrl && (
                  <div>
                    <Label className="font-medium">Website URL:</Label>
                    <p className="text-sm text-bodytext mt-1">
                      <a href={location.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {location.websiteUrl}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {location.description && (
            <div className="border-t border-border pt-6">
              <Label className="font-medium mb-2 block">Description</Label>
              <p className="text-sm text-bodytext">{location.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Created:</Label>
              <p className="text-sm text-bodytext mt-1">
                {formatDate(location.createDate)}
              </p>
            </div>
            <div>
              <Label className="font-medium">Last Updated:</Label>
              <p className="text-sm text-bodytext mt-1">
                {formatDate(location.updateDate)}
              </p>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default page;

