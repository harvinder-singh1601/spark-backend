"use client"
import React, { useEffect, useState } from "react";
import LocationForm from "@/app/components/dashboard/LocationForm";
import { useParams } from "next/navigation";
import { Spinner } from "flowbite-react";

const page = () => {
  const params = useParams();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <span className="ml-3 text-muted">Loading store...</span>
      </div>
    );
  }

  return (
    <>
      <LocationForm mode="edit" activeLocation={location} />
    </>
  );
};

export default page;

