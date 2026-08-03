import { act, renderHook } from "@testing-library/react-native";
import { router } from "expo-router";

import useUploadImage from "../useUploadImage";

// Mock expo-router so we can spy on router.push
jest.mock("expo-router", () => ({
  router: { push: jest.fn() }
}));

// NOTE: We do NOT mock "@/api/api" here.
// We want the REAL uploadImage function to run its full logic.
// Instead, we mock the network layer (globalThis.fetch) below.

const mockImage = {
  uri: "uri",
  width: 5,
  height: 5
};

const mockFetchResponse = (body: unknown, ok = true, status = 200) => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      text: () => Promise.resolve(JSON.stringify(body))
    })
  ) as unknown as typeof fetch;
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("should navigate home when upload succeeds with approved: 1", async () => {
  // The REAL uploadImage will call fetch, which returns approved: 1
  mockFetchResponse({ approved: 1 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });
  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(router.push).toHaveBeenCalledWith("/");
});

test("should NOT navigate home when upload fails", async () => {
  // The REAL uploadImage will call fetch, which returns an error status
  mockFetchResponse({ message: "Upload failed" }, false, 400);

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });
  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  expect(router.push).not.toHaveBeenCalled();
});

test("should send the correct request to the API (contract test)", async () => {
  // The REAL uploadImage will call fetch, which returns approved: 1
  mockFetchResponse({ approved: 1 });

  const { result } = await renderHook(() => useUploadImage());

  await act(async () => {
    result.current.onChangeImage(mockImage);
  });
  await act(async () => {
    await result.current.uploadSelectedImage();
  });

  // Inspect the request the REAL uploadImage built
  const [url, options] = (globalThis.fetch as jest.Mock).mock.calls[0];

  expect(url).toContain("/images/upload");
  expect(options.method).toBe("POST");
  expect(options.headers["x-api-key"]).toBeDefined();
});
