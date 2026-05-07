import { useCallback, useContext, useEffect } from "react";

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
