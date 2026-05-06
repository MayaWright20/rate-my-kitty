import { CatImage, ImageUpload } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

type ImageUploadResult = { approved?: number } | string | false;

const parseResponseBody = async (response: Response) => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
};

const getErrorMessage = (data: unknown, fallback: string) => {
  const responseData = data as { message?: string };

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  if (typeof data === "string") {
    return data;
  }

  return fallback;
};

export const uploadImage = async ({
  file,
  sub_id,
  breed_ids
}: ImageUpload): Promise<ImageUploadResult> => {
  const formData = new FormData();

  formData.append("file", {
    uri: file,
    name: "cat.jpg",
    type: "image/jpeg"
  } as any);

  try {
    const response = await fetch(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "x-api-key": `${API_KEY}`
      }
    });

    let data = await parseResponseBody(response);

    if (!response.ok) {
      data = getErrorMessage(
        data,
        `Request failed with status ${response.status}`
      );
    }

    return data as ImageUploadResult;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default async function getUploadedImages(): Promise<CatImage[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/images/?limit=10&page=0&order=DESC`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`
        }
      }
    );

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, `Request failed with status ${response.status}`)
      );
    }

    if (!Array.isArray(data)) {
      throw new Error("Profile images response was not a list");
    }

    return data as CatImage[];
  } catch (e) {
    console.error(e);
    throw e;
  }
}
