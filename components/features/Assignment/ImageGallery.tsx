'use client';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@heroui/react';
import {
  useDeleteAssignmentImage,
  useUploadAssignmentImage,
  useUploadMultipleImages,
} from '@hooks';
import { datefy, validateImageFile } from '@lib/shared';
import { type ChangeEvent, useRef, useState } from 'react';

import type { AssignmentImageResponse, ImageGalleryProps } from '@/types';

/**
 * ImageGallery Component
 * Displays assignment images with lightbox view
 * Supports manager upload with EXIF data display
 */
export function ImageGallery({
  images,
  viewMode,
  assignmentId,
  hotelId,
  onImageAdded,
  onImageDeleted,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] =
    useState<AssignmentImageResponse | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadAssignmentImage({
      assignmentId,
      hotelId,
    });

  const { mutateAsync: deleteImage } = useDeleteAssignmentImage({
    assignmentId,
    hotelId,
  });

  const { uploadMultiple, isLoading: isBatchUploading } =
    useUploadMultipleImages({
      assignmentId,
      hotelId,
    });

  const canManageImages = viewMode === 'manager';

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Validate all files
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    }

    if (invalidFiles.length > 0) {
      addToast({
        title: 'Invalid files',
        description: invalidFiles.join('\n'),
        color: 'danger',
      });
    }

    if (validFiles.length === 0) return;

    // Upload files
    setUploadingFiles(validFiles);

    if (validFiles.length === 1) {
      try {
        await uploadImage(validFiles[0]!);
        onImageAdded?.();
      } catch (error) {
        // Error handled by hook
      }
    } else {
      await uploadMultiple(validFiles);
      onImageAdded?.();
    }

    setUploadingFiles([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (image: AssignmentImageResponse) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteImage(image.id);
      onImageDeleted?.(image.id);
      if (selectedImage?.id === image.id) {
        setSelectedImage(null);
      }
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDownload = (image: AssignmentImageResponse) => {
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `assignment_${assignmentId}_image_${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Section (Manager Only) */}
      {canManageImages && (
        <Card className="shadow-sm border border-primary/20">
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                Upload Images
              </p>
              <Button
                color="primary"
                isLoading={isUploading || isBatchUploading}
                size="sm"
                variant="flat"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading || isBatchUploading
                  ? 'Uploading...'
                  : '+ Add Images'}
              </Button>
            </div>

            <input
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
            />

            {uploadingFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {uploadingFiles.map((file, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Spinner size="sm" />
                    <span className="text-xs text-default-600 flex-1 truncate">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-default-500">
              Supported formats: JPEG, PNG, WebP • Max size: 5MB
            </p>
          </CardBody>
        </Card>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card className="shadow-none bg-default-50">
          <CardBody>
            <p className="text-center text-default-500 py-8">
              No images have been uploaded to this assignment yet.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image) => (
            <ImageThumbnail
              image={image}
              key={image.id}
              onClick={() => setSelectedImage(image)}
              onDelete={canManageImages ? handleDelete : undefined}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDelete={canManageImages ? handleDelete : undefined}
        onDownload={handleDownload}
      />
    </div>
  );
}

/**
 * Image Thumbnail Card
 */
function ImageThumbnail({
  image,
  onClick,
  onDelete,
}: {
  image: AssignmentImageResponse;
  onClick: () => void;
  onDelete?: (image: AssignmentImageResponse) => void;
}) {
  return (
    <Card
      isPressable
      className="cursor-pointer hover:scale-105 transition-transform group"
      onPress={onClick}
    >
      <CardBody className="p-0 relative">
        <Image
          alt="Assignment image"
          className="w-full h-32 object-cover"
          classNames={{
            wrapper: 'w-full h-32',
          }}
          src={image.url}
        />

        {/* Delete Button Overlay */}
        {onDelete && (
          <Button
            isIconOnly
            aria-label="Delete image"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            color="danger"
            size="sm"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image);
            }}
          >
            ×
          </Button>
        )}

        {/* Image Info */}
        <div className="p-2 bg-content1">
          <p
            className="text-xs font-semibold truncate"
            title={image.uploader.name}
          >
            {image.uploader.name}
          </p>
          <p className="text-xs text-default-500">{datefy(image.uploadedAt)}</p>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Image Lightbox Modal
 */
function ImageLightbox({
  image,
  isOpen,
  onClose,
  onDownload,
  onDelete,
}: {
  image: AssignmentImageResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: AssignmentImageResponse) => void;
  onDelete?: (image: AssignmentImageResponse) => void;
}) {
  if (!image) return null;

  const hasExif = image.exif && Object.keys(image.exif).length > 0;

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <span>Image Details</span>
            <div className="flex gap-2">
              <Button
                color="primary"
                size="sm"
                variant="flat"
                onClick={() => onDownload(image)}
              >
                Download
              </Button>
              {onDelete && (
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onClick={() => {
                    onDelete(image);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          {/* Full Size Image */}
          <div className="w-full bg-black/5 flex items-center justify-center min-h-[400px]">
            <Image
              alt="Full size image"
              className="w-full h-auto max-h-[70vh] object-contain"
              src={image.url}
            />
          </div>

          {/* Image Metadata */}
          <div className="p-4 space-y-4">
            {/* Uploader Info */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Uploaded by {image.uploader.name}
                </p>
                <p className="text-xs text-default-500">
                  {datefy(image.uploadedAt)}
                </p>
              </div>
            </div>

            {/* EXIF Data */}
            {hasExif && (
              <Card className="shadow-sm bg-default-50">
                <CardBody>
                  <p className="text-sm font-semibold mb-3">
                    Image Information
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {image.exif?.timestamp && (
                      <div>
                        <p className="text-default-600">Captured</p>
                        <p className="font-medium">{image.exif.timestamp}</p>
                      </div>
                    )}

                    {image.exif?.camera && (
                      <div>
                        <p className="text-default-600">Camera</p>
                        <p className="font-medium">{image.exif.camera}</p>
                      </div>
                    )}

                    {image.exif?.dimensions && (
                      <div>
                        <p className="text-default-600">Dimensions</p>
                        <p className="font-medium">
                          {image.exif.dimensions.width} ×{' '}
                          {image.exif.dimensions.height}
                        </p>
                      </div>
                    )}

                    {image.exif?.location && (
                      <div>
                        <p className="text-default-600">Location</p>
                        <a
                          className="text-primary hover:underline font-medium"
                          href={`https://www.google.com/maps?q=${image.exif.location.latitude},${image.exif.location.longitude}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View on map →
                        </a>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/**
 * Compact Image Gallery for smaller spaces
 */
export function ImageGalleryCompact({
  images,
  onImageClick,
}: {
  images: AssignmentImageResponse[];
  onImageClick?: (image: AssignmentImageResponse) => void;
}) {
  if (images.length === 0) {
    return <p className="text-sm text-default-500 italic">No images</p>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto">
      {images.slice(0, 3).map((image) => (
        <div
          className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          key={image.id}
          role="button"
          tabIndex={0}
          onClick={() => onImageClick?.(image)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onImageClick?.(image);
            }
          }}
        >
          <Image
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md"
            src={image.url}
          />
        </div>
      ))}
      {images.length > 3 && (
        <div className="flex-shrink-0 w-16 h-16 bg-default-100 rounded-md flex items-center justify-center">
          <span className="text-xs text-default-600">+{images.length - 3}</span>
        </div>
      )}
    </div>
  );
}
