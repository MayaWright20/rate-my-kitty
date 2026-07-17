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
