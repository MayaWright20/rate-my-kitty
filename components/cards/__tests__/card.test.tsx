import { render } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { VotingContext, VotingContextValue } from "@/context/voting-context";

import Card from "../card";

const testImage = {
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

const votingContextProps: VotingContextValue = {
  errorMessagesByImageId: { errorMessagesByImageId: "errorMessagesByImageId" },
  isLoadingVotesByImageId: { isLoadingVotesByImageId: true },
  isVotingByImageId: { isVotingByImageId: true },
  loadVoteScore: jest.fn(),
  vote: jest.fn(),
  voteCountsByImageId: { voteCountsByImageId: 5 }
};

function RenderWithContext(ui: React.ReactElement) {
  return render(
    <VotingContext.Provider value={votingContextProps}>
      {ui}
    </VotingContext.Provider>
  );
}

test("should render Card when children prop is provided", async () => {
  const children = <Text>children</Text>;

  const result = await RenderWithContext(
    <Card image={testImage}>{children}</Card>
  );

  const childrenText = result.getByText("children");

  expect(childrenText).toBeOnTheScreen();
});

test("should render Card when children prop is provided", async () => {
  const children = <Text>children</Text>;

  const result = await RenderWithContext(
    <Card image={testImage}>{children}</Card>
  );

  const childrenText = result.getByText("children");

  expect(childrenText).toBeOnTheScreen();
});

test("should render Card with FavouriteIconButton component when favouriteButton prop is provided", async () => {
  const favouriteButton = {
    isFavourite: true,
    onPress: jest.fn()
  };

  const result = await RenderWithContext(
    <Card image={testImage} favouriteButton={favouriteButton} />
  );

  const favouriteIconButton = result.getByTestId("favourite-icon-button");

  expect(favouriteIconButton).toBeOnTheScreen();
});

test("should render Card with wrapperStyle when wrapperStyle prop is provided", async () => {
  const borderWidth = 45;
  const result = await RenderWithContext(
    <Card image={testImage} wrapperStyle={{ borderWidth }} />
  );

  const title = result.root;
  const flatStyle = StyleSheet.flatten(title && title.props.style);

  expect(flatStyle.borderWidth).toBe(borderWidth);
});

it("returns nothing when no children, favouriteButton or wrapperStyle are provided", async () => {
  const { toJSON } = await RenderWithContext(<Card image={testImage} />);

  expect(toJSON()).toBeNull();
});
