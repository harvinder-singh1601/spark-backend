"use client"
import { Badge, Button, Dropdown, DropdownItem, Table, TextInput, Spinner } from "flowbite-react"
import CardBox from "../shared/CardBox";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LocationManagement() {
  const router = useRouter();
  const [allLocations, setAllLocations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [fixedLocations, setFixedLocations] = useState([]);
  const [itemsCount] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPagination, setCurrentPagination] = useState(1);
  const [loading, setLoading] = useState(true);

  async function handleLocations() {
    try {
      setLoading(true);
      const response = await fetch("/api/store");
      const result = await response.json();
      if (result.data) {
        setFixedLocations(result.data);
        handleRenderedLocations();
      }
    } catch (error) {
      toast.error("Failed to fetch stores", {
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
    handleLocations();
  }, []);

  function handleInput() {
    if (inputValue) {
      const modifiedLocations = fixedLocations.filter((item: any) =>
        item.shopName.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllLocations(modifiedLocations.slice(0, itemsCount));
    } else {
      handleRenderedLocations();
    }
  }

  useEffect(() => {
    handleInput();
  }, [inputValue]);

  function handleRenderedLocations() {
    const filtered = statusFilter === "All"
      ? fixedLocations
      : fixedLocations.filter((item: any) => item.status === statusFilter);
    const locations = filtered.slice((currentPagination - 1) * itemsCount, itemsCount * currentPagination);
    setAllLocations(locations);
  }

  useEffect(() => {
    handleRenderedLocations();
  }, [currentPagination, statusFilter, fixedLocations]);

  function handleFilterLocations() {
    if (statusFilter === "All") {
      setAllLocations(fixedLocations.slice(0, itemsCount));
    } else {
      const modifiedLocations = fixedLocations.filter((item: any) => item.status === statusFilter);
      setAllLocations(modifiedLocations.slice(0, itemsCount));
    }
    setCurrentPagination(1);
  }

  useEffect(() => {
    handleFilterLocations();
  }, [statusFilter]);

  async function handleDelete(locationId: string) {
    if (!confirm("Are you sure you want to delete this store?")) {
      return;
    }

    try {
      const response = await fetch(`/api/store/${locationId}`, {
        method: "DELETE",
        headers: { 'content-type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Store deleted successfully!', {
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
        handleLocations();
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to delete store', {
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
      toast.error("Failed to delete store", {
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

  const filteredLocations = statusFilter === "All"
    ? fixedLocations
    : fixedLocations.filter((item: any) => item.status === statusFilter);

  const totalPages = Math.ceil(filteredLocations.length / itemsCount);

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="xl" />
          <span className="ml-3 text-muted">Loading stores...</span>
        </div>
      </CardBox>
    );
  }

  return (
    <>
      <CardBox>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h5 className="card-title">Store Management</h5>
            <div className="flex gap-4">
              <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                  <button className="px-4 py-1.5 rounded-md bg-lightprimary text-primary font-medium flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer transition-all">
                    <Icon icon="akar-icons:sort" width={18} height={18} />
                    Filter
                  </button>
                )}
              >
                <DropdownItem
                  onClick={() => setStatusFilter("All")}
                  className={`${statusFilter == "All" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  All
                </DropdownItem>
                <DropdownItem
                  onClick={() => setStatusFilter("active")}
                  className={`${statusFilter == "active" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  Active
                </DropdownItem>
                <DropdownItem
                  onClick={() => setStatusFilter("inactive")}
                  className={`${statusFilter == "inactive" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  Inactive
                </DropdownItem>
                <DropdownItem
                  onClick={() => setStatusFilter("closed")}
                  className={`${statusFilter == "closed" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  Closed
                </DropdownItem>
              </Dropdown>
              <div className="relative">
                <TextInput
                  id="search"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                  type="text"
                  className="form-control search min-w-60"
                  placeholder="Search locations here..."
                  required
                />
                <span className="absolute top-1/2 start-3 -translate-y-1/2">
                  <Icon icon="lucide:search" width={20} height={20} className="text-muted" />
                </span>
              </div>
              <Button
                onClick={() => router.push("/admin/locations/new")}
                color="primary"
                className="flex items-center gap-2"
              >
                <Icon icon="solar:add-circle-outline" width={18} height={18} />
                Add New Store
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
                      Shop Name
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      City
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Status
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Owner
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Created Date
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Action
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-border dark:divide-darkborder">
                    {allLocations && allLocations.length > 0 ? (
                      allLocations.map((item: any, index: number) => (
                        <Table.Row key={item.id || index}>
                          <Table.Cell className="md:min-w-auto max-w-[200px]">
                            <div>
                              <h6 className="text-sm font-semibold mb-1">{item.shopName}</h6>
                              {item.address && (
                                <p className="text-xs text-muted">{item.address}</p>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm w-fit">
                              {item.city}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <Badge
                              color={
                                item.status === "active" ? "success" :
                                item.status === "inactive" ? "warning" : "error"
                              }
                              size="xs"
                              className="text-[13px] px-3 rounded-full justify-center py-0.5"
                            >
                              {item.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm w-fit">
                              {item.ownerName}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm w-fit">
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
                                onClick={() => router.push(`/admin/locations/${item.id}`)}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="solar:eye-outline" className="text-base" />
                                  View
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => router.push(`/admin/locations/${item.id}/edit`)}
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
                        <Table.Cell colSpan={6} className="text-center py-8">
                          <p className="text-muted">No stores found</p>
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

