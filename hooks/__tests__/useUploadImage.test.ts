import { act, renderHook } from "@testing-library/react-native";

import { uploadImage } from "@/api/api";

import useUploadImage from "../useUploadImage";

jest.mock("@/api/api", () => ({
  uploadImage: jest.fn()
}));

const mockImage = {
  uri: "uri",
  width: 5,
  height: 5
};

test("should return isSubmitBtnDisabled as true if there is not an image", async () => {
  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(null);
  });

  await act(async () => {
    result.current.uploadSelectedImage();
  });

  expect(result.current.isSubmitBtnDisabled).toBe(true);
});

test("should return error message from api if api provides an error message", async () => {
  const UPLOAD_IMAGE = uploadImage as jest.Mock;
  const ERROR_MESSAGE = new Error("Error message from api");
  UPLOAD_IMAGE.mockRejectedValue(ERROR_MESSAGE);

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    result.current.uploadSelectedImage();
  });

  expect(result.current.errorMessage).toBe("Error message from api");
});

test("should return 'Image upload failed' error message if api does not provide an error message", async () => {
  (uploadImage as jest.Mock).mockRejectedValue("");

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    result.current.uploadSelectedImage();
  });

  expect(result.current.errorMessage).toBe("Image upload failed");
});

test("should return image as null if onChangeImage is called", async () => {
  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    result.current.uploadSelectedImage();
  });

  await act(async () => {
    result.current.resetImage();
  });

  expect(result.current.image).toBe(null);
});

test("should call resetImage making image null if image upload is successful and the result from the api is result.approved : 1", async () => {
  (uploadImage as jest.Mock).mockResolvedValue({ approved: 1 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(result.current.image).toBeNull();
});

test("should call resetImage making image null if image upload is successful and the result from the api is result.approved : 1", async () => {
  (uploadImage as jest.Mock).mockResolvedValue({ approved: 1 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(result.current.image).toBeNull();
});

test("should show error message if api is successful but approved.result is not 1", async () => {
  (uploadImage as jest.Mock).mockResolvedValue({ approved: 0 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(result.current.errorMessage).not.toBeNull();
});

test("should show error message from api if api is successful but approved.result is not 1 and the result is of type string", async () => {
  (uploadImage as jest.Mock).mockResolvedValue("api error message result");

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });

  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(result.current.errorMessage).toBe("api error message result");
});
