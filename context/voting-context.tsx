import { createContext, useCallback, useMemo, useState } from "react";

import { getImageVoteScore, voteImage } from "@/api/api";
import { VoteValue } from "@/types";

type VotingContextValue = {
  errorMessagesByImageId: Record<string, string | null>;
  isLoadingVotesByImageId: Record<string, boolean>;
  isVotingByImageId: Record<string, boolean>;
  loadVoteScore: (imageId: string, subId?: string) => Promise<number | void>;
  vote: (imageId: string, value: VoteValue, subId?: string) => Promise<void>;
  voteCountsByImageId: Record<string, number>;
};

export const VotingContext = createContext<VotingContextValue | null>(null);

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
