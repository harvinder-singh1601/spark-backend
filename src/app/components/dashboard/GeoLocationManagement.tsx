"use client"
import { Badge, Button, Dropdown, DropdownItem, Table, TextInput, Spinner } from "flowbite-react"
import CardBox from "../shared/CardBox";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Bounce, toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";

export default function GeoLocationManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const baseUrl = isAdmin ? "/admin/geo-locations" : "/geo-locations";
  
  const [allGeoLocations, setAllGeoLocations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [fixedGeoLocations, setFixedGeoLocations] = useState([]);
  const [itemsCount] = useState(10);
  const [currentPagination, setCurrentPagination] = useState(1);
  const [loading, setLoading] = useState(true);

  async function handleGeoLocations() {
    try {
      setLoading(true);
      const response = await fetch("/api/location");
      const result = await response.json();
      if (result.data) {
        setFixedGeoLocations(result.data);
        handleRenderedGeoLocations();
      }
    } catch (error) {
      toast.error("Failed to fetch locations", {
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
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGeoLocations();
  }, []);

  function handleInput() {
    if (inputValue) {
      const modifiedGeoLocations = fixedGeoLocations.filter((item: any) =>
        item.city.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.provinceAbbv.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.slug.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllGeoLocations(modifiedGeoLocations.slice(0, itemsCount));
    } else {
      handleRenderedGeoLocations();
    }
  }

  useEffect(() => {
    handleInput();
  }, [inputValue]);

  function handleRenderedGeoLocations() {
    const geoLocations = fixedGeoLocations.slice((currentPagination - 1) * itemsCount, itemsCount * currentPagination);
    setAllGeoLocations(geoLocations);
  }

  useEffect(() => {
    handleRenderedGeoLocations();
  }, [currentPagination, fixedGeoLocations]);

  async function handleDelete(geoLocationId: string) {
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      const response = await fetch(`/api/location/${geoLocationId}`, {
        method: "DELETE",
        headers: { 'content-type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Location deleted successfully!', {
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
        handleGeoLocations();
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to delete location', {
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
      toast.error("Failed to delete location", {
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
  }

  const totalPages = Math.ceil(fixedGeoLocations.length / itemsCount);

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="xl" />
          <span className="ml-3 text-muted">Loading locations...</span>
        </div>
      </CardBox>
    );
  }

  return (
    <>
      <CardBox>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h5 className="card-title">Location Management</h5>
            <div className="flex gap-4">
              <div className="relative">
                <TextInput
                  id="search"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                  type="text"
                  className="form-control search min-w-60"
                  placeholder="Search locations..."
                  required
                />
                <span className="absolute top-1/2 start-3 -translate-y-1/2">
                  <Icon icon="lucide:search" width={20} height={20} className="text-muted" />
                </span>
              </div>
              <Button
                onClick={() => router.push(`${baseUrl}/new`)}
                color="primary"
                className="flex items-center gap-2"
              >
                <Icon icon="solar:add-circle-outline" width={18} height={18} />
                Add New Location
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-x-auto border border-border rounded-md">
                <Table>
                  <Table.Head className="bg-gray-50">
                    <Table.HeadCell className="text-sm font-semibold">
                      City
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Province Abbreviation
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Slug
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Created Date
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Action
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-border dark:divide-darkborder">
                    {allGeoLocations && allGeoLocations.length > 0 ? (
                      allGeoLocations.map((item: any, index: number) => (
                        <Table.Row key={item.id || index}>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-semibold dark:text-darklink text-sm">
                              {item.city}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm">
                              {item.provinceAbbv}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm">
                              {item.slug}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm">
                              {new Date(item.createDate).toLocaleDateString()}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <Dropdown
                              placement="left-start"
                              label=""
                              dismissOnClick={false}
                              renderTrigger={() => (
                                <Icon
                                  icon="tabler:dots-vertical"
                                  className="text-muted dark:text-darklink hover:text-primary dark:hover:text-primary text-lg shrink-0 cursor-pointer"
                                />
                              )}
                            >
                              <DropdownItem
                                onClick={() => router.push(`${baseUrl}/${item.id}`)}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="solar:eye-outline" className="text-base" />
                                  View
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => router.push(`${baseUrl}/${item.id}/edit`)}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="fluent:edit-16-regular" className="text-base" />
                                  Edit
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(item.id)}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="fluent:delete-28-regular" className="text-base" />
                                  Delete
                                </div>
                              </DropdownItem>
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={5} className="text-center py-8">
                          <p className="text-muted">No locations found</p>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-end py-4 pt-2 px-6">
                    <div className="flex items-center divide-x border border-border rounded-md">
                      <button
                        onClick={() => {
                          setCurrentPagination((prev) => {
                            if (prev === 1) {
                              return prev;
                            } else {
                              return prev - 1;
                            }
                          });
                        }}
                        disabled={currentPagination === 1}
                        className={`py-1.5 px-4 text-sm font-medium hover:bg-lightprimary hover:text-primary ${
                          currentPagination === 1
                            ? "bg-gray-100 cursor-not-allowed text-gray-300 hover:!bg-gray-100 hover:!text-gray-300"
                            : "cursor-pointer hover:bg-none hover:text-primary"
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPagination(index + 1)}
                          className={`py-1.5 px-4 text-sm font-medium hover:bg-lightprimary hover:text-primary cursor-pointer ${
                            currentPagination === index + 1 ? "bg-lightprimary text-primary" : null
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setCurrentPagination((prev) => {
                            if (prev < totalPages) {
                              return prev + 1;
                            } else {
                              return prev;
                            }
                          });
                        }}
                        disabled={currentPagination === totalPages}
                        className={`py-1.5 px-4 text-sm font-medium hover:bg-lightprimary hover:text-primary ${
                          currentPagination === totalPages
                            ? "bg-gray-100 cursor-not-allowed text-gray-300 hover:!bg-gray-100 hover:!text-gray-300"
                            : "cursor-pointer hover:bg-none hover:text-primary"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
}

