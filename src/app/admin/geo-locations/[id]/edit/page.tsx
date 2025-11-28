"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GeoLocationForm from "@/app/components/dashboard/GeoLocationForm";
import { Spinner } from "flowbite-react";
import CardBox from "@/app/components/shared/CardBox";

const EditGeoLocationPage = () => {
  const params = useParams();
  const id = params.id as string;
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
    <div>
      <GeoLocationForm activeGeoLocation={geoLocation} mode="edit" />
    </div>
  );
};

export default EditGeoLocationPage;

