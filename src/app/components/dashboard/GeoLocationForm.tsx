"use client"
import { Button, Label, Spinner, Textarea, TextInput } from "flowbite-react"
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "../shared/CardBox";
import { useRouter, usePathname } from "next/navigation";

export default function GeoLocationForm({ activeGeoLocation, mode }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditMode = mode === "edit";
  const isAdmin = pathname?.startsWith("/admin") || false;
  const baseUrl = isAdmin ? "/admin/geo-locations" : "/geo-locations";
  
  const [city, setCity] = useState("");
  const [provinceAbbv, setProvinceAbbv] = useState("");
  const [slug, setSlug] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && activeGeoLocation) {
      setCity(activeGeoLocation.city || "");
      setProvinceAbbv(activeGeoLocation.provinceAbbv || "");
      setSlug(activeGeoLocation.slug || "");
      setHtmlContent(activeGeoLocation.htmlContent || "");
      setImages(activeGeoLocation.images || []);
    }
  }, [activeGeoLocation, isEditMode]);

  const handleAddImage = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    e.preventDefault();
    const trimmedImage = imageInput.trim();
    if (trimmedImage && !images.includes(trimmedImage)) {
      setImages([...images, trimmedImage]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter((image: string) => image !== imageToRemove));
  };

  // Generate slug from city and province if slug is empty
  useEffect(() => {
    if (!isEditMode && city && provinceAbbv && !slug) {
      const generatedSlug = `${city.toLowerCase().replace(/\s+/g, '-')}-${provinceAbbv.toLowerCase()}`;
      setSlug(generatedSlug);
    }
  }, [city, provinceAbbv, slug, isEditMode]);

  async function handleSubmit() {
    if (!city || !provinceAbbv || !slug || !htmlContent) {
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
        city,
        provinceAbbv,
        slug,
        htmlContent,
        images: images || [],
      };

      const url = isEditMode ? `/api/location/${activeGeoLocation.id}` : "/api/location";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`Location ${isEditMode ? 'updated' : 'created'} successfully!`, {
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
        // Navigate to the locations list page
        router.push(baseUrl);
      } else {
        const result = await response.json();
        toast.error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} location`, {
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
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} location`, {
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
    <CardBox>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h5 className="card-title">{isEditMode ? "Edit Location" : "Add New Location"}</h5>
          <Button
            onClick={() => router.back()}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="city" value="City" className="font-medium" />
            <span className="text-red-500 ml-1">*</span>
            <TextInput
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              className="form-control mt-2"
              placeholder="Enter city name"
              required
            />
          </div>

          <div>
            <Label htmlFor="provinceAbbv" value="Province Abbreviation" className="font-medium" />
            <span className="text-red-500 ml-1">*</span>
            <TextInput
              id="provinceAbbv"
              value={provinceAbbv}
              onChange={(e) => setProvinceAbbv(e.target.value.toUpperCase())}
              type="text"
              className="form-control mt-2"
              placeholder="e.g., CA, NY, ON"
              maxLength={10}
              required
            />
            <p className="text-xs text-muted mt-1">
              Province or state abbreviation (e.g., CA for California, ON for Ontario)
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="slug" value="Slug" className="font-medium" />
          <span className="text-red-500 ml-1">*</span>
          <TextInput
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            type="text"
            className="form-control mt-2"
            placeholder="e.g., toronto-on"
            required
          />
          <p className="text-xs text-muted mt-1">
            SEO-friendly URL slug (generated from city and province if left empty)
          </p>
        </div>

        <div>
          <Label htmlFor="htmlContent" value="HTML Content Page" className="font-medium" />
          <span className="text-red-500 ml-1">*</span>
          <Textarea
            id="htmlContent"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="form-control mt-2"
            placeholder="Enter HTML content for SEO page..."
            rows={15}
            required
          />
          <p className="text-xs text-muted mt-1">
            HTML content for the location page (for SEO purposes)
          </p>
        </div>

        {/* Images */}
        <div className="border-t border-border pt-6">
          <Label className="font-medium mb-2 block text-lg">Location Images</Label>
          <p className="text-sm text-muted mb-4">
            Add image URLs that will be displayed on the location page. These images will be shown when rendering the HTML content.
          </p>
          <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md min-h-[42px] items-center">
            {images && images.length > 0 ? (
              images.map((image: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  <span className="max-w-[200px] truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <Icon icon="solar:close-circle-bold" width={16} height={16} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted text-sm">No images added yet</span>
            )}
          </div>
          <div className="flex gap-2">
            <TextInput
              id="images"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddImage(e);
                }
              }}
              type="text"
              className="form-control flex-1"
              placeholder="Enter image URL and press Enter"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              color="primary"
              className="px-4"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading}
            color="primary"
            className="flex items-center gap-2 disabled:hover:bg-none"
          >
            {isLoading ? <Spinner aria-label="Loading spinner" size="sm" /> : null}
            {isEditMode ? "Update Location" : "Create Location"}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            color="light"
            className="flex items-center gap-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </CardBox>
  );
}
