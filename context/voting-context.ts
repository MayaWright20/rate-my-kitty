import { createContext } from "react";

import { VoteValue } from "@/types";

export type VotingContextValue = {
  errorMessagesByImageId: Record<string, string | null>;
  isLoadingVotesByImageId: Record<string, boolean>;
  isVotingByImageId: Record<string, boolean>;
  loadVoteScore: (imageId: string, subId?: string) => Promise<number | void>;
  vote: (imageId: string, value: VoteValue, subId?: string) => Promise<void>;
  voteCountsByImageId: Record<string, number>;
};

export const VotingContext = createContext<VotingContextValue | null>(null);
