/**
 * Media utility functions for handling various media types
 * Maintains Single Responsibility Principle by centralizing media processing logic
 */

/**
 * Check if a URL is a YouTube URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is a YouTube URL
 */
export const isYouTubeUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

/**
 * Convert a YouTube URL to an embed URL
 * Supports various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * @param {string} url - The YouTube URL to convert
 * @returns {string|null} - The embed URL or null if invalid
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

/**
 * Get appropriate fallback image based on content type
 * @param {string} type - The type of content (publication, seminar, professor)
 * @returns {string} - The fallback image URL
 */
export const getFallbackImage = (type) => {
  const fallbacks = {
    publication:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60",
    seminar:
      "https://images.unsplash.com/photo-1558980394-0f36c6f7c87d?w=1200&auto=format&fit=crop&q=60",
    professor:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
  };

  return fallbacks[type] || fallbacks.publication;
};
