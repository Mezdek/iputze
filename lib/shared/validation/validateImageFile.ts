/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be an image (JPEG, PNG, or WebP)',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Image must be less than 5MB',
    };
  }

  return { valid: true };
}
