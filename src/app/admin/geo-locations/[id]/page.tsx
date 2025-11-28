"use client"
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CardBox from "@/app/components/shared/CardBox";
import { Button, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const ViewGeoLocationPage = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.id as string;
  const isAdmin = pathname.startsWith("/admin");
  const baseUrl = isAdmin ? "/admin/geo-locations" : "/geo-locations";
  
  const [geoLocation, setGeoLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGeoLocation();
    }
  }, [id]);

  const fetchGeoLocation = async () => {
    try {
      const response = await fetch(`/api/location/${id}`);
      const result = await response.json();
      if (result.success) {
        setGeoLocation(result.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center py-12">
          <Spinner size="xl" />
        </div>
      </CardBox>
    );
  }

  if (!geoLocation) {
    return (
      <CardBox>
        <div className="text-center py-12">
          <p className="text-muted">Location not found</p>
        </div>
      </CardBox>
    );
  }

  return (
    <CardBox>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h5 className="card-title">Location Details</h5>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`${baseUrl}/${id}/edit`)}
              color="primary"
              className="flex items-center gap-2"
            >
              <Icon icon="fluent:edit-16-regular" width={18} height={18} />
              Edit
            </Button>
            <Button
              onClick={() => router.push(baseUrl)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-muted mb-1">City</p>
            <p className="text-base font-medium">{geoLocation.city}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted mb-1">Province Abbreviation</p>
            <p className="text-base font-medium">{geoLocation.provinceAbbv}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-muted mb-1">Slug</p>
          <p className="text-base font-medium">{geoLocation.slug}</p>
        </div>

        {/* Images */}
        {geoLocation.images && geoLocation.images.length > 0 && (
          <div className="border-t border-border pt-6">
            <h6 className="text-base font-semibold mb-4">Location Images</h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {geoLocation.images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-video rounded-md overflow-hidden border border-border">
                  <img
                    src={image}
                    alt={`Location image ${index + 1}`}
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

        <div className="border-t border-border pt-6">
          <h6 className="text-base font-semibold mb-4">HTML Content</h6>
          <div 
            className="prose max-w-none border border-border rounded-md p-4 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: geoLocation.htmlContent }}
          />
        </div>

        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Created Date</p>
              <p className="text-base font-medium">
                {new Date(geoLocation.createDate).toLocaleDateString()} {new Date(geoLocation.createDate).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted mb-1">Last Updated</p>
              <p className="text-base font-medium">
                {new Date(geoLocation.updateDate).toLocaleDateString()} {new Date(geoLocation.updateDate).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardBox>
  );
};

export default ViewGeoLocationPage;

