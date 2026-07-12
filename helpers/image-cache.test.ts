import { hasImageUrls, prefetchCatImages } from "./image-cache";

// const images = {
//   id: "",
//   url: "",
//   width: null,
//   height: null,
//   mime_type: "",
//   entities: [""],
//   breeds: [
//     {
//       id: 1,
//       name: "",
//       wikipedia_url: ""
//     }
//   ],
//   animals: [""],
//   categories: [""]
// };

describe("prefetchCatImages", () => {
  it("should call hasImageUrls", async () => {
    await prefetchCatImages([]);
    const imageUrls = hasImageUrls([]);

    expect(imageUrls).toHaveBeenCalled();
  });

  it("should return early if imageUrl.length is 0", async () => {
    await prefetchCatImages([]);
    const imageUrls = hasImageUrls([]);

    expect(imageUrls).toBeUndefined();
  });
});
