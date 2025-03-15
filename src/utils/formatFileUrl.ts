import { prod } from "@/utils/prod"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const formatFileUrl = (fileUrl: string) => {
  if (!fileUrl) return `${BASE_URL}${prod}/media/images/unknown/empty.png`;
  return fileUrl.startsWith("http") ? fileUrl : `${BASE_URL}${fileUrl}`;
};
