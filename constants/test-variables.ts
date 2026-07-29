import { VotingContextValue } from "@/context/voting-context";

export const testImage = {
  id: "id",
  url: "url",
  width: 5,
  height: 5,
  mime_type: "mime_type",
  entities: ["entities"],
  breeds: [
    {
      id: 5,
      name: "name",
      wikipedia_url: "wikipendia_url"
    }
  ],
  animals: ["string"],
  categories: ["string"]
};

export const votingContextProps: VotingContextValue = {
  errorMessagesByImageId: { errorMessagesByImageId: "errorMessagesByImageId" },
  isLoadingVotesByImageId: { isLoadingVotesByImageId: true },
  isVotingByImageId: { isVotingByImageId: true },
  loadVoteScore: jest.fn(),
  vote: jest.fn(),
  voteCountsByImageId: { voteCountsByImageId: 5 }
};
