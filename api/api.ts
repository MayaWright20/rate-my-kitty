import { API_KEY, BASE_URL } from "@/constants/api";

import {
  CatImage,
  Favourite,
  FavouriteResult,
  ImageUpload,
  ImageUploadResult,
  Vote,
  VoteValue
} from "../types";

const parseResponseBody = async (response: Response) => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
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

const buildVotesUrl = (subId?: string) => {
  const url = new URL(`${BASE_URL}/votes`);

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
  file
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

export const voteImage = async (
  imageId: string,
  value: VoteValue,
  subId?: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/votes`, {
      method: "POST",
      body: JSON.stringify({
        image_id: imageId,
        sub_id: subId,
        value
      }),
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

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getVotes = async (subId?: string) => {
  try {
    const response = await fetch(buildVotesUrl(subId), {
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
      throw new Error("Votes response was not a list");
    }

    return data as Vote[];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getImageVoteScore = async (imageId: string, subId?: string) => {
  const votes = await getVotes(subId);

  return votes
    .filter((vote) => vote.image_id === imageId)
    .reduce((score, vote) => score + (vote.value === 1 ? 1 : -1), 0);
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
