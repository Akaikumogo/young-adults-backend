/**
 * Get full image URL from upload path
 * @param path - Upload path like '/uploads/filename.jpg' or 'uploads/filename.jpg'
 * @param baseUrl - Optional base URL (defaults to process.env.API_URL or http://localhost:3000)
 * @returns Full URL to the image
 */
export function getImageUrl(path?: string | null, baseUrl?: string): string | null {
  if (!path || path.trim() === '') return null;

  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If it's a base64 data URL, return as is
  if (path.startsWith('data:')) {
    return path;
  }

  // Get base URL from parameter, environment variable, or default
  const API_BASE_URL = baseUrl || process.env.API_URL || process.env.BASE_URL || 'http://localhost:3000';

  // Add base URL to the path
  // Handle both '/uploads/filename.jpg' and 'uploads/filename.jpg' formats
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

