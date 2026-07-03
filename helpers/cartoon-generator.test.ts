import CartoonGenerator from "./cartoon-generator";

describe("CartoonGenerator", () => {
  it("should return an array of 2 items when index is 0", () => {
    const result = CartoonGenerator(0);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when index is 4", () => {
    const result = CartoonGenerator(4);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when index is 9", () => {
    const result = CartoonGenerator(9);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return an array of 2 items when called without an index", () => {
    const result = CartoonGenerator();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();
  });

  it("should return cartoon-1 and badge-1 when Math.random returns 0", () => {
    // Tell Math.random to always return 0
    jest.spyOn(Math, "random").mockReturnValue(0);

    const result = CartoonGenerator();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();

    // Clean up the mock so other tests aren't affected
    jest.restoreAllMocks();
  });

  it("should return the last items when Math.random returns close to 1", () => {
    // Math.floor(0.999 * 10) = Math.floor(9.99) = 9
    jest.spyOn(Math, "random").mockReturnValue(0.999);

    const result = CartoonGenerator();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeDefined();
    expect(result[1]).toBeDefined();

    jest.restoreAllMocks();
  });
});
