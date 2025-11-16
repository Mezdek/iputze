'use client';
import { Image } from '@components';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@heroui/react';
import {
  useBatchUploadImage,
  useDeleteImage,
  useImages,
  useUploadImage,
} from '@hooks';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';

import { datefy } from '@/lib/shared/utils/date';
import { validateImageFile } from '@/lib/shared/validation/validateImageFile';
import type { ImageGalleryProps, ImageResponse } from '@/types';

/**
 * ImageGallery Component
 * Displays task images with lightbox view
 * Supports manager upload with EXIF data display
 */
export function ImageGallery({
  viewMode,
  taskId,
  hotelId,
  onImageAdded,
  onImageDeleted,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(
    null
  );
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images } = useImages({ hotelId, taskId });
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage({
    taskId,
    hotelId,
  });

  const { batchUpload, isLoading: isBatchUploading } = useBatchUploadImage({
    taskId,
    hotelId,
  });

  const { mutateAsync: deleteImage } = useDeleteImage({
    taskId,
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
      } catch {
        // Error handled by hook
      }
    } else {
      await batchUpload(validFiles);
      onImageAdded?.();
    }

    setUploadingFiles([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (image: ImageResponse) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    await deleteImage(image.id);
    onImageDeleted?.(image.id);
    if (selectedImage?.id === image.id) {
      setSelectedImage(null);
    }
  };

  const handleDownload = (image: ImageResponse) => {
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `task_${taskId}_image_${image.id}.jpg`;
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
                onPress={() => fileInputRef.current?.click()}
              >
                {isUploading || isBatchUploading
                  ? 'Uploading...'
                  : '+ Add Images'}
              </Button>
            </div>

            <input
              accept="image/jpeg,image/jpg,image/png,image/webp"
              capture="environment"
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
                    <span className="text-xs flex-1 truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs">
              Supported formats: JPEG, PNG, WebP • Max size: 5MB
            </p>
          </CardBody>
        </Card>
      )}

      {/* Images Grid */}
      {images && images.length === 0 ? (
        <Card className="shadow-none bg-default-50">
          <CardBody>
            <p className="text-center py-8">
              No images have been uploaded to this task yet.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images &&
            images.map((image) => (
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
  image: ImageResponse;
  onClick: () => void;
  onDelete?: (image: ImageResponse) => void;
}) {
  return (
    <Card className="cursor-pointer hover:scale-105 transition-transform group aa">
      <CardBody className="p-0 relative items-center">
        <Image
          alt="Task image"
          className="w-full h-32 k"
          classNames={{
            wrapper: 'w-full h-32 bg-contain bg-no-repeat bg-center',
          }}
          src={image.url}
          onClick={onClick}
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
            onPress={() => {
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
          <p className="text-xs  ">{datefy(image.uploadedAt)}</p>
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
  image: ImageResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: ImageResponse) => void;
  onDelete?: (image: ImageResponse) => void;
}) {
  if (!image) return null;

  const hasExif = image.exif && Object.keys(image.exif).length > 0;

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="flex items-center">Image Details</h3>
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
          {/* EXIF Data */}
          {hasExif && (
            <Card className="shadow-sm bg-default-50">
              <CardBody>
                <p className="text-sm font-semibold mb-3">Image Information</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {image.exif?.timestamp && (
                    <div>
                      <p>Captured</p>
                      <p className="font-medium">{image.exif.timestamp}</p>
                    </div>
                  )}

                  {image.exif?.camera && (
                    <div>
                      <p>Camera</p>
                      <p className="font-medium">{image.exif.camera}</p>
                    </div>
                  )}

                  {image.exif?.dimensions && (
                    <div>
                      <p>Dimensions</p>
                      <p className="font-medium">
                        {image.exif.dimensions.width} ×{' '}
                        {image.exif.dimensions.height}
                      </p>
                    </div>
                  )}

                  {image.exif?.location && (
                    <div>
                      <p>Location</p>
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
        </ModalBody>
        <ModalFooter className="justify-around">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Uploaded by {image.uploader.name}
            </p>
            <p className="text-xs  ">{datefy(image.uploadedAt)}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              color="primary"
              size="sm"
              variant="flat"
              onPress={() => onDownload(image)}
            >
              Download
            </Button>
            {onDelete && (
              <Button
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => {
                  onDelete(image);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </ModalFooter>
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
  images: ImageResponse[];
  onImageClick?: (image: ImageResponse) => void;
}) {
  if (images.length === 0) {
    return <p className="text-sm   italic">No images</p>;
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
        <div className="flex-shrink-0 w-16 h-16 rounded-md flex items-center justify-center">
          <span className="text-xs">+{images.length - 3}</span>
        </div>
      )}
    </div>
  );
}
