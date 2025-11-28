"use client"
import { Button, Checkbox, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Textarea, TextInput } from "flowbite-react"
import { useEffect, useReducer, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function BlogFormModal({ openModal, setOpenModal, activeBlog, mode }: any) {
  const isEditMode = mode === "edit";
  const initialBlogInfo = isEditMode && activeBlog ? {
    title: activeBlog.title || "",
    slug: activeBlog.slug || "",
    content: activeBlog.content || "",
    excerpt: activeBlog.excerpt || "",
    author: activeBlog.author || "",
    featuredImage: activeBlog.featuredImage || "",
    tags: activeBlog.tags || [],
    published: activeBlog.published || false,
  } : {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "",
    featuredImage: "",
    tags: [],
    published: false,
  };

  function reducer(blogInfo: any, action: { type: string, payload?: any }) {
    switch (action.type) {
      case "SET_TITLE":
        return { ...blogInfo, title: action.payload };
      case "SET_SLUG":
        return { ...blogInfo, slug: action.payload };
      case "SET_CONTENT":
        return { ...blogInfo, content: action.payload };
      case "SET_EXCERPT":
        return { ...blogInfo, excerpt: action.payload };
      case "SET_AUTHOR":
        return { ...blogInfo, author: action.payload };
      case "SET_FEATURED_IMAGE":
        return { ...blogInfo, featuredImage: action.payload };
      case "SET_TAGS":
        return { ...blogInfo, tags: action.payload };
      case "SET_PUBLISHED":
        return { ...blogInfo, published: action.payload };
      case "RESET":
        return initialBlogInfo;
      default:
        return blogInfo;
    }
  }

  const [blogInfo, dispatch] = useReducer(reducer, initialBlogInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && blogInfo.title) {
      const generatedSlug = blogInfo.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!blogInfo.slug || blogInfo.slug === "") {
        dispatch({ type: "SET_SLUG", payload: generatedSlug });
      }
    }
  }, [blogInfo.title, isEditMode]);

  useEffect(() => {
    if (isEditMode && activeBlog) {
      dispatch({ type: "SET_TITLE", payload: activeBlog.title || "" });
      dispatch({ type: "SET_SLUG", payload: activeBlog.slug || "" });
      dispatch({ type: "SET_CONTENT", payload: activeBlog.content || "" });
      dispatch({ type: "SET_EXCERPT", payload: activeBlog.excerpt || "" });
      dispatch({ type: "SET_AUTHOR", payload: activeBlog.author || "" });
      dispatch({ type: "SET_FEATURED_IMAGE", payload: activeBlog.featuredImage || "" });
      dispatch({ type: "SET_TAGS", payload: activeBlog.tags || [] });
      dispatch({ type: "SET_PUBLISHED", payload: activeBlog.published || false });
      setTagInput("");
    } else {
      dispatch({ type: "RESET" });
      setTagInput("");
    }
  }, [activeBlog, isEditMode, openModal]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !blogInfo.tags.includes(trimmedTag)) {
      dispatch({ type: "SET_TAGS", payload: [...blogInfo.tags, trimmedTag] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    dispatch({ type: "SET_TAGS", payload: blogInfo.tags.filter((tag: string) => tag !== tagToRemove) });
  };

  async function handleSubmit() {
    if (!blogInfo.title || !blogInfo.slug || !blogInfo.content || !blogInfo.author) {
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
        title: blogInfo.title,
        slug: blogInfo.slug,
        content: blogInfo.content,
        excerpt: blogInfo.excerpt || null,
        author: blogInfo.author,
        featuredImage: blogInfo.featuredImage || null,
        tags: blogInfo.tags || [],
        published: blogInfo.published,
      };

      const url = isEditMode ? `/api/blog/${activeBlog.id}` : "/api/blog";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`Blog ${isEditMode ? 'updated' : 'created'} successfully!`, {
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
        setOpenModal(false);
        dispatch({ type: "RESET" });
      } else {
        const result = await response.json();
        toast.error(result.error || `Failed to ${isEditMode ? 'update' : 'create'} blog`, {
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
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} blog`, {
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
    <>
      <Modal show={openModal} onClose={() => {
        setOpenModal(false);
        dispatch({ type: "RESET" });
        setTagInput("");
      }} size="xl">
        <ModalHeader className="p-4 !text-lg font-medium">
          {isEditMode ? "Edit Blog" : "Add New Blog"}
        </ModalHeader>
        <ModalBody className="pt-0 max-h-[70vh] overflow-y-auto">
          <form action="" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Title" className="font-medium" />
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <TextInput
                  id="title"
                  value={blogInfo.title}
                  onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
                  type="text"
                  className="form-control"
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="slug" value="Slug" className="font-medium" />
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <TextInput
                  id="slug"
                  value={blogInfo.slug}
                  onChange={(e) => dispatch({ type: "SET_SLUG", payload: e.target.value })}
                  type="text"
                  className="form-control"
                  placeholder="blog-post-slug"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="author" value="Author" className="font-medium" />
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <TextInput
                  id="author"
                  value={blogInfo.author}
                  onChange={(e) => dispatch({ type: "SET_AUTHOR", payload: e.target.value })}
                  type="text"
                  className="form-control"
                  placeholder="Enter author name"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="content" value="Content" className="font-medium" />
                  <span className="text-red-500 ml-1">*</span>
                </div>
                <Textarea
                  id="content"
                  value={blogInfo.content}
                  onChange={(e) => dispatch({ type: "SET_CONTENT", payload: e.target.value })}
                  className="form-control"
                  placeholder="Enter blog content"
                  rows={8}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="excerpt" value="Excerpt" className="font-medium" />
                </div>
                <Textarea
                  id="excerpt"
                  value={blogInfo.excerpt}
                  onChange={(e) => dispatch({ type: "SET_EXCERPT", payload: e.target.value })}
                  className="form-control"
                  placeholder="Enter blog excerpt (optional)"
                  rows={3}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="featuredImage" value="Featured Image URL" className="font-medium" />
                </div>
                <TextInput
                  id="featuredImage"
                  value={blogInfo.featuredImage}
                  onChange={(e) => dispatch({ type: "SET_FEATURED_IMAGE", payload: e.target.value })}
                  type="text"
                  className="form-control"
                  placeholder="Enter featured image URL"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="tags" value="Tags" className="font-medium" />
                </div>
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md min-h-[42px] items-center">
                  {blogInfo.tags && blogInfo.tags.length > 0 ? (
                    blogInfo.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <Icon icon="solar:close-circle-bold" width={16} height={16} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-muted text-sm">No tags added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <TextInput
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag(e);
                      }
                    }}
                    type="text"
                    className="form-control flex-1"
                    placeholder="Type a tag and press Enter"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    color="primary"
                    className="px-4"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="published"
                  checked={blogInfo.published}
                  onChange={(e) => dispatch({ type: "SET_PUBLISHED", payload: e.target.checked })}
                />
                <Label htmlFor="published" value="Published" className="font-medium" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Button type="submit" disabled={isLoading} color={"primary"} className="w-full flex items-center gap-2 disabled:hover:bg-none">
                {isLoading ? <Spinner aria-label="Loading spinner" size="sm" /> : null}
                {isEditMode ? "Update Blog" : "Create Blog"}
              </Button>
              <Button
                onClick={() => {
                  setOpenModal(false);
                  dispatch({ type: "RESET" });
                }}
                disabled={isLoading}
                color={"error"}
                className="w-full flex items-center gap-2 disabled:hover:bg-none"
              >
                Close
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

