const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `${BACKEND_URL}${image}`;
};