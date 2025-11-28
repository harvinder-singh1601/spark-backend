"use client"
import { Button, Label, Modal, ModalBody, ModalHeader } from "flowbite-react"
import { Badge } from "flowbite-react";

export default function BlogViewModal({ openModal, setOpenModal, activeBlog }: any) {
  if (!activeBlog) return null;

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

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
        <ModalHeader className="p-4 !text-lg font-medium">
          {activeBlog.title}
        </ModalHeader>
        <ModalBody className="pt-0 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="font-medium">Status:</Label>
                <Badge
                  color={activeBlog.published ? "success" : "warning"}
                  size="sm"
                  className="text-[13px] px-3 rounded-full"
                >
                  {activeBlog.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="text-sm text-muted">
                Views: {activeBlog.views || 0}
              </div>
            </div>

            <div>
              <Label className="font-medium">Slug:</Label>
              <p className="text-sm text-bodytext mt-1">{activeBlog.slug}</p>
            </div>

            <div>
              <Label className="font-medium">Author:</Label>
              <p className="text-sm text-bodytext mt-1">{activeBlog.author}</p>
            </div>

            {activeBlog.excerpt && (
              <div>
                <Label className="font-medium">Excerpt:</Label>
                <p className="text-sm text-bodytext mt-1">{activeBlog.excerpt}</p>
              </div>
            )}

            {activeBlog.featuredImage && (
              <div>
                <Label className="font-medium">Featured Image:</Label>
                <div className="mt-2">
                  <img
                    src={activeBlog.featuredImage}
                    alt={activeBlog.title}
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            )}

            {activeBlog.tags && activeBlog.tags.length > 0 && (
              <div>
                <Label className="font-medium">Tags:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeBlog.tags.map((tag: string, index: number) => (
                    <Badge key={index} color="info" size="sm" className="text-[13px] px-2 rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="font-medium">Content:</Label>
              <div className="mt-2 text-sm text-bodytext whitespace-pre-wrap">
                {activeBlog.content}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <Label className="font-medium">Created:</Label>
                <p className="text-sm text-bodytext mt-1">
                  {formatDate(activeBlog.createDate)}
                </p>
              </div>
              <div>
                <Label className="font-medium">Last Updated:</Label>
                <p className="text-sm text-bodytext mt-1">
                  {formatDate(activeBlog.updateDate)}
                </p>
              </div>
              {activeBlog.publishedAt && (
                <div>
                  <Label className="font-medium">Published At:</Label>
                  <p className="text-sm text-bodytext mt-1">
                    {formatDate(activeBlog.publishedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpenModal(false)} color="primary">
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

