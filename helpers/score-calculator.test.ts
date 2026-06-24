import { calculateScore } from "./score-calculator";

describe("calculateScore", () => {
  it("should return 0 if upvotes and downvotes are 0", () => {
    expect(calculateScore(0, 0)).toBe(0);
  });

  it("should return 100 if upvotes are 10 and downvotes are 0", () => {
    expect(calculateScore(10, 0)).toBe(100);
  });

  it("should return 50 if upvotes are 5 and downvotes are 5", () => {
    expect(calculateScore(5, 5)).toBe(50);
  });

  it("should return 75 if upvotes are 3 and downvotes are 1", () => {
    expect(calculateScore(3, 1)).toBe(75);
  });

  it("should return 25 if upvotes are 1 and downvotes are 3", () => {
    expect(calculateScore(1, 3)).toBe(25);
  });
});
