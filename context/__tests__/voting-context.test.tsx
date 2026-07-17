import { act, renderHook } from "@testing-library/react-native";

import { getImageVoteScore, voteImage } from "@/api/api";

import { useVotingProviderValue } from "../voting-context";

// The provider calls API functions, so we need to mock them
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("should start with empty state", async () => {
  const { result } = await renderHook(() => useVotingProviderValue());

  expect(result.current.voteCountsByImageId).toEqual({});
  expect(result.current.isLoadingVotesByImageId).toEqual({});
  expect(result.current.isVotingByImageId).toEqual({});
  expect(result.current.errorMessagesByImageId).toEqual({});
});

test("should update count when loadVoteScore succeeds", async () => {
  // Tell the mock API to return a score of 5
  (getImageVoteScore as jest.Mock).mockResolvedValue(5);

  const { result } = await renderHook(() => useVotingProviderValue());

  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.loadVoteScore("imageId");
  });

  // Check the count was updated
  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);

  // Check loading is finished
  expect(result.current.isLoadingVotesByImageId["imageId"]).toBe(false);
});

test("should store error message when loadVoteScore fails", async () => {
  // Tell the mock API to throw an error
  (getImageVoteScore as jest.Mock).mockRejectedValue(
    new Error("Failed to fetch")
  );

  const { result } = await renderHook(() => useVotingProviderValue());

  // Try to load the score (it will fail)
  await act(async () => {
    await result.current.loadVoteScore("imageId");
  });

  // Check the error message was stored
  expect(result.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to fetch"
  );

  // Check loading is finished
  expect(result.current.isLoadingVotesByImageId["imageId"]).toBe(false);

  // Check the count was NOT updated (stayed undefined)
  expect(result.current.voteCountsByImageId["imageId"]).toBeUndefined();
});

test("should not call voteImage when vote is called and isVotingByImageId[imageId] is true", async () => {
  (voteImage as jest.Mock).mockResolvedValue(2); // resolved value can be any value

  const { result } = await renderHook(() => useVotingProviderValue());
  result.current.isVotingByImageId["imageId"] = true;

  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(voteImage).not.toHaveBeenCalled();
});

test("should call voteImage when vote is called and isVotingByImageId[imageId] is false", async () => {
  (voteImage as jest.Mock).mockResolvedValue(2); // resolved value can be any value

  const { result } = await renderHook(() => useVotingProviderValue());

  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(result.current.isVotingByImageId["imageId"]).toBe(false);
  expect(voteImage).toHaveBeenCalled();
});

test("should reset vote when vote is called and voteImage fails and voteImage value is 1", async () => {
  (voteImage as jest.Mock).mockRejectedValue(0); // rejected mock value can be any value

  const { result } = await renderHook(() => useVotingProviderValue());

  result.current.voteCountsByImageId["imageId"] = 5;
  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(voteImage).toHaveBeenCalled();
  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);
});

test("should reset vote when vote is called and voteImage fails and voteImage value is 0", async () => {
  (voteImage as jest.Mock).mockRejectedValue(5); // rejected mock value can be any value

  const { result } = await renderHook(() => useVotingProviderValue());

  result.current.voteCountsByImageId["imageId"] = 5;
  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.vote("imageId", 0);
  });

  expect(voteImage).toHaveBeenCalled();
  expect(result.current.voteCountsByImageId["imageId"]).toBe(5);
});

test("should store error message when vote fails", async () => {
  (getImageVoteScore as jest.Mock).mockRejectedValue(
    new Error("Failed to fetch")
  );

  const { result } = await renderHook(() => useVotingProviderValue());

  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(result.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to vote"
  );
});
