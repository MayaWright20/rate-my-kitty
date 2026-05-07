import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getImageVoteScore, voteImage } from "@/api/api";
import { VotingContext } from "@/context/voting-context";
import { VoteValue } from "@/types";

type UseVotingOptions = {
  initialCount?: number;
  subId?: string;
};

export default function useVoting(
  imageId: string,
  { initialCount = 0, subId }: UseVotingOptions = {}
) {
  const voting = useContext(VotingContext);

  if (!voting) {
    throw new Error("useVoting must be used inside VotingProvider");
  }

  const {
    errorMessagesByImageId,
    isLoadingVotesByImageId,
    isVotingByImageId,
    loadVoteScore: loadVoteScoreFromContext,
    vote: voteFromContext,
    voteCountsByImageId
  } = voting;

  const loadVoteScore = useCallback(
    () => loadVoteScoreFromContext(imageId, subId),
    [imageId, loadVoteScoreFromContext, subId]
  );

  useEffect(() => {
    loadVoteScore();
  }, [loadVoteScore]);

  const vote = useCallback(
    (value: VoteValue) => voteFromContext(imageId, value, subId),
    [imageId, subId, voteFromContext]
  );

  const upvote = useCallback(() => vote(1), [vote]);
  const downvote = useCallback(() => vote(0), [vote]);

  return {
    count: voteCountsByImageId[imageId] ?? initialCount,
    downvote,
    errorMessage: errorMessagesByImageId[imageId] ?? null,
    isLoadingVotes: !!isLoadingVotesByImageId[imageId],
    isVoting: !!isVotingByImageId[imageId],
    loadVoteScore,
    upvote,
    vote
  };
}

export function useVotingProviderValue() {
  const [voteCountsByImageId, setVoteCountsByImageId] = useState<
    Record<string, number>
  >({});
  const [isLoadingVotesByImageId, setIsLoadingVotesByImageId] = useState<
    Record<string, boolean>
  >({});
  const [isVotingByImageId, setIsVotingByImageId] = useState<
    Record<string, boolean>
  >({});
  const [errorMessagesByImageId, setErrorMessagesByImageId] = useState<
    Record<string, string | null>
  >({});

  const loadVoteScore = useCallback(async (imageId: string, subId?: string) => {
    setIsLoadingVotesByImageId((currentIds) => ({
      ...currentIds,
      [imageId]: true
    }));
    setErrorMessagesByImageId((currentMessages) => ({
      ...currentMessages,
      [imageId]: null
    }));

    try {
      const score = await getImageVoteScore(imageId, subId);
      setVoteCountsByImageId((currentCounts) => ({
        ...currentCounts,
        [imageId]: score
      }));
      return score;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch votes";
      setErrorMessagesByImageId((currentMessages) => ({
        ...currentMessages,
        [imageId]: message
      }));
    } finally {
      setIsLoadingVotesByImageId((currentIds) => ({
        ...currentIds,
        [imageId]: false
      }));
    }
  }, []);

  const vote = useCallback(
    async (imageId: string, value: VoteValue, subId?: string) => {
      if (isVotingByImageId[imageId]) {
        return;
      }

      const countChange = value === 1 ? 1 : -1;

      setIsVotingByImageId((currentIds) => ({
        ...currentIds,
        [imageId]: true
      }));
      setErrorMessagesByImageId((currentMessages) => ({
        ...currentMessages,
        [imageId]: null
      }));
      setVoteCountsByImageId((currentCounts) => ({
        ...currentCounts,
        [imageId]: (currentCounts[imageId] ?? 0) + countChange
      }));

      try {
        await voteImage(imageId, value, subId);
      } catch (e) {
        setVoteCountsByImageId((currentCounts) => ({
          ...currentCounts,
          [imageId]: (currentCounts[imageId] ?? 0) - countChange
        }));
        const message = e instanceof Error ? e.message : "Failed to vote";
        setErrorMessagesByImageId((currentMessages) => ({
          ...currentMessages,
          [imageId]: message
        }));
      } finally {
        setIsVotingByImageId((currentIds) => ({
          ...currentIds,
          [imageId]: false
        }));
      }
    },
    [isVotingByImageId]
  );

  return useMemo(
    () => ({
      errorMessagesByImageId,
      isLoadingVotesByImageId,
      isVotingByImageId,
      loadVoteScore,
      vote,
      voteCountsByImageId
    }),
    [
      errorMessagesByImageId,
      isLoadingVotesByImageId,
      isVotingByImageId,
      loadVoteScore,
      vote,
      voteCountsByImageId
    ]
  );
}
