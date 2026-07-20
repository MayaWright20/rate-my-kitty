import { act, renderHook } from "@testing-library/react-native";

import { getImageVoteScore, voteImage } from "@/api/api";
import useVoting from "@/hooks/useVoting";

import { useVotingProviderValue, VotingContext } from "../voting-context";

// Mock the API - we don't want real network calls
jest.mock("@/api/api", () => ({
  getImageVoteScore: jest.fn(),
  voteImage: jest.fn()
}));

test("should update count when upvote is called (integration test)", async () => {
  // Step 1: Make the API return a score of 0 initially
  (getImageVoteScore as jest.Mock).mockResolvedValue(0);
  // Make voteImage succeed
  (voteImage as jest.Mock).mockResolvedValue({});

  // Step 2: Create the REAL provider (like the TV)
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider (like the remote)
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook
  await act(async () => {
    await result.current.upvote();
  });

  // Step 6: Check the count updated in the PROVIDER (not the hook)
  expect(providerResult.current.voteCountsByImageId["imageId"]).toBe(1);
});

test("should update count when downvote is called (integration test)", async () => {
  // Step 1: Make the API return a score of 0 initially
  (getImageVoteScore as jest.Mock).mockResolvedValue(0);
  // Make voteImage succeed
  (voteImage as jest.Mock).mockResolvedValue({});

  // Step 2: Create the REAL provider (like the TV)
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider (like the remote)
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook
  await act(async () => {
    await result.current.downvote();
  });

  // Step 6: Check the count updated in the PROVIDER (not the hook)
  expect(providerResult.current.voteCountsByImageId["imageId"]).toBe(-1);
});

test("should load count when loadVoteScore is mounted (integration test)", async () => {
  (getImageVoteScore as jest.Mock).mockRejectedValue(
    new Error("Failed to fetch")
  );

  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  await act(async () => {
    await result.current.loadVoteScore();
  });

  expect(providerResult.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to fetch"
  );
});

test("should store fallback error message when loadVoteScore fails with a non-Error", async () => {
  (getImageVoteScore as jest.Mock).mockRejectedValue("Something went wrong");

  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  await act(async () => {
    await result.current.loadVoteScore();
  });

  expect(providerResult.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to fetch votes"
  );
});

test("should rollback count when voteImage fails (integration test)", async () => {
  // Step 1: Mock getImageVoteScore to return 5 (initial count)
  (getImageVoteScore as jest.Mock).mockResolvedValue(5);
  // Mock voteImage to fail
  (voteImage as jest.Mock).mockRejectedValue(new Error("Network error"));

  // Step 2: Create the REAL provider (like the TV)
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider (like the remote)
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook
  // This will: optimistically add 1 (count becomes 6), then voteImage fails, then rollback (count back to 5)
  await act(async () => {
    await result.current.upvote();
  });

  // Step 6: Check the count rolled back to the original value
  expect(providerResult.current.voteCountsByImageId["imageId"]).toBe(5);
});

test("should store error message when voteImage fails with an Error (integration test)", async () => {
  // Step 1: Mock getImageVoteScore to return 0
  (getImageVoteScore as jest.Mock).mockResolvedValue(0);
  // Mock voteImage to fail with an Error
  (voteImage as jest.Mock).mockRejectedValue(new Error("Network error"));

  // Step 2: Create the REAL provider
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook (it will fail)
  await act(async () => {
    await result.current.upvote();
  });

  // Step 6: Check the error message in the provider
  expect(providerResult.current.errorMessagesByImageId["imageId"]).toBe(
    "Network error"
  );
});

test("should store fallback error message when voteImage fails with a non-Error (integration test)", async () => {
  // Step 1: Mock getImageVoteScore to return 0
  (getImageVoteScore as jest.Mock).mockResolvedValue(0);
  // Mock voteImage to fail with a string (not an Error)
  (voteImage as jest.Mock).mockRejectedValue("Something went wrong");

  // Step 2: Create the REAL provider
  const { result: providerResult } = await renderHook(() =>
    useVotingProviderValue()
  );

  // Step 3: Create useVoting connected to the REAL provider
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <VotingContext.Provider value={providerResult.current}>
        {children}
      </VotingContext.Provider>
    )
  });

  // Step 4: Wait for the initial loadVoteScore to complete
  await act(async () => {
    await providerResult.current.loadVoteScore("imageId");
  });

  // Step 5: Call upvote through the hook (it will fail)
  await act(async () => {
    await result.current.upvote();
  });

  // Step 6: Check the fallback error message in the provider
  expect(providerResult.current.errorMessagesByImageId["imageId"]).toBe(
    "Failed to vote"
  );
});

test("should not call voteImage when vote is called and isVotingByImageId[imageId] is true (guard clause on line 67)", async () => {
  (voteImage as jest.Mock).mockResolvedValue(2); // resolved value can be any value

  const { result } = await renderHook(() => useVotingProviderValue());
  result.current.isVotingByImageId["imageId"] = true;

  // Wrap the async operation in act() to handle state updates properly
  await act(async () => {
    await result.current.vote("imageId", 1);
  });

  expect(voteImage).toHaveBeenCalled();
});
