import { render, screen } from "@testing-library/react-native";

import VoteButton from "../voting-btn";

test("should render voting button", async () => {
  const mockFnOnDownVote = jest.fn();
  const mockFnOnUpVotes = jest.fn();

  await render(
    <VoteButton
      count={5}
      onDownvote={mockFnOnDownVote}
      onUpvote={mockFnOnUpVotes}
    />
  );

  const votingButton = screen.getByTestId("vote-button");

  expect(votingButton).toBeOnTheScreen();
});
