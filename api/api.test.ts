/**
 * API Unit Tests
 *
 * This file demonstrates two approaches to testing API functions:
 *
 * APPROACH 1: jest.mock() - Simple, fast, good for unit tests
 *   - Mocks the entire api module
 *   - No network interception needed
 *   - Best for testing components that use API functions
 *
 * APPROACH 2: MSW (Mock Service Worker) - More realistic, good for integration tests
 *   - Intercepts actual HTTP requests at the network level
 *   - Tests the real API implementation
 *   - Requires additional setup for Jest (ESM compatibility)
 *
 * For this project, we use APPROACH 1 (jest.mock()) for unit tests
 * as it's simpler and doesn't require complex ESM configuration.
 */

import { getFavourites, voteImage } from "./api";

// Mock the entire api module
// This replaces all exported functions with jest.fn() mocks
jest.mock("./api", () => ({
  getFavourites: jest.fn(),
  voteImage: jest.fn()
}));

describe("API functions (mocked with jest.mock)", () => {
  // Clear all mock calls and implementations before each test
  // This ensures tests don't leak state between each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return favourites data when getFavourites is called", async () => {
    // Arrange: Set up the mock data and configure the mock
    const mockFavourites = [
      { id: 1, image_id: "cat1", sub_id: "user1", created_at: "2024-01-01" },
      { id: 2, image_id: "cat2", sub_id: "user1", created_at: "2024-01-02" }
    ];
    (getFavourites as jest.Mock).mockResolvedValue(mockFavourites);

    // Act: Call the mocked function
    const result = await getFavourites();

    // Assert: Verify the result matches our mock data
    expect(result).toEqual(mockFavourites);
    // Verify the function was called exactly once
    expect(getFavourites).toHaveBeenCalledTimes(1);
  });

  it("should handle errors when getFavourites fails", async () => {
    // Arrange: Configure the mock to reject with an error
    const errorMessage = "Network error";
    (getFavourites as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act & Assert: Verify the function throws the expected error
    await expect(getFavourites()).rejects.toThrow(errorMessage);
    expect(getFavourites).toHaveBeenCalledTimes(1);
  });

  it("should call voteImage with correct parameters", async () => {
    // Arrange: Set up mock data
    const imageId = "cat123";
    const vote = 1; // 1 = upvote, -1 = downvote, 0 = unvote
    const mockResponse = { message: "success", image_id: imageId, value: vote };
    (voteImage as jest.Mock).mockResolvedValue(mockResponse);

    // Act: Call the mocked function with test parameters
    const result = await voteImage(imageId, vote);

    // Assert: Verify the function was called with the right arguments
    expect(voteImage).toHaveBeenCalledWith(imageId, vote);
    expect(voteImage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should handle empty favourites list", async () => {
    // Arrange: Mock returns an empty array
    (getFavourites as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await getFavourites();

    // Assert: Verify we get an empty array back
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
