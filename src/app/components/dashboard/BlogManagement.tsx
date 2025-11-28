"use client"
import { Badge, Button, Dropdown, DropdownItem, Select, Table, TextInput, Spinner } from "flowbite-react"
import CardBox from "../shared/CardBox";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Bounce, toast } from "react-toastify";
import BlogFormModal from "./BlogFormModal";
import BlogViewModal from "./BlogViewModal";

export default function BlogManagement() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [fixedBlogs, setFixedBlogs] = useState([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [activeBlog, setActiveBlog] = useState<any>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [itemsCount] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPagination, setCurrentPagination] = useState(1);
  const [loading, setLoading] = useState(true);

  async function handleBlogs() {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      const result = await response.json();
      if (result.data) {
        setFixedBlogs(result.data);
        setAllBlogs(result.data.slice(0, itemsCount));
      }
    } catch (error) {
      toast.error("Failed to fetch blogs", {
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
    handleBlogs();
  }, [openFormModal]);

  function handleInput() {
    if (inputValue) {
      const modifiedBlogs = fixedBlogs.filter((item: any) =>
        item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.author.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllBlogs(modifiedBlogs.slice(0, itemsCount));
    } else {
      handleRenderedBlogs();
    }
  }

  useEffect(() => {
    handleInput();
  }, [inputValue]);

  function handleRenderedBlogs() {
    const filtered = statusFilter === "All"
      ? fixedBlogs
      : fixedBlogs.filter((item: any) =>
          statusFilter === "Published" ? item.published : !item.published
        );
    const blogs = filtered.slice((currentPagination - 1) * itemsCount, itemsCount * currentPagination);
    setAllBlogs(blogs);
  }

  useEffect(() => {
    handleRenderedBlogs();
  }, [currentPagination, statusFilter, fixedBlogs]);

  function handleFilterBlogs() {
    if (statusFilter === "All") {
      setAllBlogs(fixedBlogs.slice(0, itemsCount));
    } else {
      const modifiedBlogs = fixedBlogs.filter((item: any) =>
        statusFilter === "Published" ? item.published : !item.published
      );
      setAllBlogs(modifiedBlogs.slice(0, itemsCount));
    }
    setCurrentPagination(1);
  }

  useEffect(() => {
    handleFilterBlogs();
  }, [statusFilter]);

  async function handleDelete(blogId: string) {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: "DELETE",
        headers: { 'content-type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Blog deleted successfully!', {
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
        handleBlogs();
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to delete blog', {
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
      toast.error("Failed to delete blog", {
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

  async function handleTogglePublish(blogId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: "PUT",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully!`, {
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
        handleBlogs();
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to update blog status', {
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
      toast.error("Failed to update blog status", {
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

  const filteredBlogs = statusFilter === "All"
    ? fixedBlogs
    : fixedBlogs.filter((item: any) =>
        statusFilter === "Published" ? item.published : !item.published
      );

  const totalPages = Math.ceil(filteredBlogs.length / itemsCount);

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="xl" />
          <span className="ml-3 text-muted">Loading blogs...</span>
        </div>
      </CardBox>
    );
  }

  return (
    <>
      <CardBox>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h5 className="card-title">Blog Management</h5>
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
                  onClick={() => setStatusFilter("Published")}
                  className={`${statusFilter == "Published" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  Published
                </DropdownItem>
                <DropdownItem
                  onClick={() => setStatusFilter("Draft")}
                  className={`${statusFilter == "Draft" ? 'bg-lightprimary text-primary' : ''}`}
                >
                  Draft
                </DropdownItem>
              </Dropdown>
              <div className="relative">
                <TextInput
                  id="search"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                  type="text"
                  className="form-control search min-w-60"
                  placeholder="Search blogs here..."
                  required
                />
                <span className="absolute top-1/2 start-3 -translate-y-1/2">
                  <Icon icon="lucide:search" width={20} height={20} className="text-muted" />
                </span>
              </div>
              <Button
                onClick={() => {
                  setFormMode("add");
                  setActiveBlog(null);
                  setOpenFormModal(true);
                }}
                color="primary"
                className="flex items-center gap-2"
              >
                <Icon icon="solar:add-circle-outline" width={18} height={18} />
                Add New Blog
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
                      Title
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Author
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Status
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Views
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Created Date
                    </Table.HeadCell>
                    <Table.HeadCell className="text-sm font-semibold">
                      Action
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-border dark:divide-darkborder">
                    {allBlogs && allBlogs.length > 0 ? (
                      allBlogs.map((item: any, index: number) => (
                        <Table.Row key={item.id || index}>
                          <Table.Cell className="md:min-w-auto max-w-[200px]">
                            <div>
                              <h6 className="text-sm font-semibold mb-1">{item.title}</h6>
                              {item.slug && (
                                <p className="text-xs text-muted">{item.slug}</p>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm w-fit">
                              {item.author}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <Badge
                              color={item.published ? "success" : "warning"}
                              size="xs"
                              className="text-[13px] px-3 rounded-full justify-center py-0.5"
                            >
                              {item.published ? "Published" : "Draft"}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap">
                            <p className="text-bodytext font-medium dark:text-darklink text-sm w-fit">
                              {item.views || 0}
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
                                onClick={() => {
                                  setActiveBlog(item);
                                  setOpenViewModal(true);
                                }}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="solar:eye-outline" className="text-base" />
                                  View
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setFormMode("edit");
                                  setActiveBlog(item);
                                  setOpenFormModal(true);
                                }}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon icon="fluent:edit-16-regular" className="text-base" />
                                  Edit
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleTogglePublish(item.id, item.published)}
                              >
                                <div className="flex gap-2 items-center text-muted dark:text-darklink">
                                  <Icon
                                    icon={item.published ? "solar:eye-closed-outline" : "solar:eye-outline"}
                                    className="text-base"
                                  />
                                  {item.published ? "Unpublish" : "Publish"}
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
                          <p className="text-muted">No blogs found</p>
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
      <BlogFormModal
        openModal={openFormModal}
        setOpenModal={setOpenFormModal}
        activeBlog={activeBlog}
        mode={formMode}
      />
      {activeBlog && (
        <BlogViewModal
          openModal={openViewModal}
          setOpenModal={setOpenViewModal}
          activeBlog={activeBlog}
        />
      )}
    </>
  );
}

