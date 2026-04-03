// Backend API URL
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'http://localhost:8000/api' 
    : 'https://fancytechintegration.onrender.com/api');

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If image path already includes http/https (Cloudinary URL or full URL), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a Cloudinary public_id (no slashes or starts with folder name)
  // This means it's stored in Cloudinary but we need the full URL
  // For now, we'll assume Cloudinary URLs are always full URLs
  // If you have public_ids, you'd need to construct the URL here
  
  // Otherwise, prepend the backend URL (for legacy local uploads)
  return `${API_BASE_URL}${imagePath}`;
};
