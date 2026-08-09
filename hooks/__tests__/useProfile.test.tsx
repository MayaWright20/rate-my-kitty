import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import getUploadedImages from "@/api/api";

import useProfile from "../useProfile";

jest.mock("@/api/api", () => ({
  __esModule: true,
  default: jest.fn()
}));

// A fresh pantry per test, with retries OFF (we don't want failed store trips
// retried 3 times during tests) and gcTime: Infinity (no cache-cleanup timers,
// so Jest can exit cleanly after the test run).
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } }
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

test("should fetch images when the query succeeds", async () => {
  const mockImages = [
    {
      id: "cat_123",
      url: "https://example.com/cat.jpg",
      width: 5,
      height: 5,
      mime_type: "image/jpeg",
      entities: ["cat"],
      breeds: [],
      animals: ["cat"],
      categories: ["cute"]
    }
  ];
  (getUploadedImages as jest.Mock).mockResolvedValue(mockImages);

  // NOTE: renderHook is ASYNC in @testing-library/react-native v14 — the
  // missing `await` is exactly why `result` was `undefined` before!
  const { result } = await renderHook(() => useProfile(), {
    wrapper: createWrapper()
  });

  // No getProfileImages() call anymore — useQuery fetches on its own!
  await waitFor(() => expect(result.current.images).toHaveLength(1));

  expect(result.current.images[0].id).toBe("cat_123");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.errorMessage).toBeNull();
});

test("should surface the error when the query fails", async () => {
  (getUploadedImages as jest.Mock).mockRejectedValue(new Error("Network error"));

  const { result } = await renderHook(() => useProfile(), {
    wrapper: createWrapper()
  });

  await waitFor(() => expect(result.current.errorMessage).toBe("Network error"));

  expect(result.current.images).toHaveLength(0);
  expect(result.current.isLoading).toBe(false);
});

test("should use fallback message for non-Error rejections", async () => {
  (getUploadedImages as jest.Mock).mockRejectedValue("Something went wrong");

  const { result } = await renderHook(() => useProfile(), {
    wrapper: createWrapper()
  });

  await waitFor(() =>
    expect(result.current.errorMessage).toBe("Failed to fetch profile images")
  );
});
