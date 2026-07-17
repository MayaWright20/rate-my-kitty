import voteCalculator from "../vote-calculator";

describe("voteCalculator", () => {
  it("should return 0 when upvotes are 0 and downvotes are 0", () => {
    expect(voteCalculator(0, 0)).toBe(0);
  });

  it("should return -10 when upvotes are 0 and downvotes are -10", () => {
    expect(voteCalculator(0, -10)).toBe(-10);
  });

  it("should return 10 when upvotes are 10 and downvotes are 0", () => {
    expect(voteCalculator(10, 0)).toBe(10);
  });

  it("should return -20 when upvotes are -10 and downvotes are -10", () => {
    expect(voteCalculator(-10, -10)).toBe(-20);
  });
});
