import { ImageUpload } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export const uploadImage = async ({ file, sub_id, breed_ids }: ImageUpload) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file,
    name: "cat.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const response = await fetch(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "x-api-key": `${API_KEY}`,
      },
    });

    const responseText = await response.text();
    let data: unknown = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }
    }

    if (!response.ok) {
      const responseData = data as { message?: string };
      const message =
        typeof responseData?.message === "string"
          ? responseData.message
          : typeof data === "string"
            ? data
            : `Request failed with status ${response.status}`;
      data = message;
    }

    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};
