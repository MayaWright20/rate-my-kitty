import { CatImage, ImageUpload } from "../types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

type ImageUploadResult = { approved?: number } | string | false;
type FavouriteResult = { id?: number; message: string };

export type Favourite = {
  id: number;
  image_id: string;
  image?: CatImage;
  sub_id?: string;
};

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

const isDuplicateFavouriteError = (message: string) =>
  message.includes("DUPLICATE_FAVOURITE");

const buildFavouritesUrl = (subId?: string) => {
  const url = new URL(`${BASE_URL}/favourites`);

  if (subId) {
    url.searchParams.set("sub_id", subId);
  }

  return url.toString();
};

const appendImageUploadFile = (
  formData: FormData,
  file: ImageUpload["file"]
) => {
  if (file.file) {
    formData.append("file", file.file);
    return;
  }

  formData.append("file", {
    uri: file.uri,
    name: file.fileName ?? "cat.jpg",
    type: file.mimeType ?? "image/jpeg"
  } as any);
};

export const uploadImage = async ({
  file,
  sub_id,
  breed_ids
}: ImageUpload): Promise<ImageUploadResult> => {
  const formData = new FormData();

  appendImageUploadFile(formData, file);

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

export const favouriteImage = async (imageId: string, subId?: string) => {
  try {
    const response = await fetch(`${BASE_URL}/favourites`, {
      method: "POST",
      body: JSON.stringify({
        image_id: imageId,
        sub_id: subId
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`
      }
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      const errorMessage = getErrorMessage(
        data,
        `Request failed with status ${response.status}`
      );

      if (isDuplicateFavouriteError(errorMessage)) {
        return { message: "ALREADY_FAVOURITED" };
      }

      throw new Error(errorMessage);
    }

    return data as FavouriteResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getFavourites = async (subId?: string) => {
  try {
    const response = await fetch(buildFavouritesUrl(subId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`
      }
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, `Request failed with status ${response.status}`)
      );
    }

    if (!Array.isArray(data)) {
      throw new Error("Favourites response was not a list");
    }

    return data as Favourite[];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteFavourite = async (favouriteId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/favourites/${favouriteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${API_KEY}`
      }
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, `Request failed with status ${response.status}`)
      );
    }

    return data as FavouriteResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const toggleFavouriteItem = async (imageId: string, subId?: string) => {
  const favourites = await getFavourites(subId);
  const existingFavourite = favourites.find(
    (favourite) => favourite.image_id === imageId
  );

  if (existingFavourite) {
    await deleteFavourite(existingFavourite.id);
    return { isFavourite: false };
  }

  await favouriteImage(imageId, subId);
  return { isFavourite: true };
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
