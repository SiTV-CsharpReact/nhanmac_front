export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3600/api',
  uploadUrl: process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:3600/api/upload/image',
} as const; 