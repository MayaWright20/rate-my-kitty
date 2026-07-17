import { renderHook } from "@testing-library/react-native";
import React from "react";

import { VotingContext, VotingContextType } from "@/context/voting-context";

import useVoting from "../useVoting";

// 1. Create the wrapper component that has context
function RenderWithContext({
  children,
  value
}: {
  children: React.ReactNode;
  value: VotingContextType;
}) {
  return (
    <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
  );
}

test("should return 0 when imageId are no votes", async () => {
  // 2. Create the mock context
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };
  // 3. Render the hook with the wrapper and pass in the context
  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  // 4. Check the count
  expect(result.current.count).toBe(0);
});

test("should call loadVoteScore on mount", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  expect(mockContext.loadVoteScore).toHaveBeenCalled();
});

test("should call vote with 1 when upvote is called", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  result.current.upvote();
  expect(mockContext.vote).toHaveBeenCalledWith("imageId", 1, undefined);
});

test("should call vote with 0 when downvote is called", async () => {
  const mockContext = {
    errorMessagesByImageId: {},
    isLoadingVotesByImageId: {},
    isVotingByImageId: {},
    loadVoteScore: jest.fn(),
    vote: jest.fn(),
    voteCountsByImageId: {}
  };

  const { result } = await renderHook(() => useVoting("imageId"), {
    wrapper: ({ children }) => (
      <RenderWithContext value={mockContext}>{children}</RenderWithContext>
    )
  });

  result.current.downvote();
  expect(mockContext.vote).toHaveBeenCalledWith("imageId", 0, undefined);
});

test("should throw an error when votingContext is null", async () => {
  const mockContext = null;

  jest.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    renderHook(() => useVoting("imageId"), {
      wrapper: ({ children }) => (
        <RenderWithContext value={mockContext}>{children}</RenderWithContext>
      )
    })
  ).rejects.toThrow("useVoting must be used inside VotingProvider");

  jest.restoreAllMocks();
});
