# 📚 react-query (TanStack Query) — Live Learning Doc

> This is our **living document** for learning react-query. Every lesson we do
> together gets added here — with real-life examples and real code before/after,
> so we can look back and remember *why* we did things, not just *what* we did.
>
> 📌 **How we learn:** every lesson explains **what** we're doing (the Goal),
> **how** to do it (the Task), and — most importantly — **why** we're doing it
> (the reasoning a senior dev would give before touching the code). If you ever
> read a step and think "but why?", that's a fair question — ask me, and I'll
> add the answer here.

---

## 🎯 The Big Idea

Every app has two kinds of "state":

1. **Client state** — data that only lives on *your phone*. E.g. "is the grid
   view toggled on?" or "what text is the user typing in the search box?" This
   is the kind of state `useState` is perfect for.
2. **Server state** — data that lives on *someone else's computer* (the API
   server). E.g. "the list of uploaded cat images", "which cats are favourited",
   "the vote score for each cat". This data is **asynchronous** (arrives later),
   can **change behind our back** (someone else votes on your cat!), and is
   **shared** between multiple screens.

**react-query (a.k.a. TanStack Query) is a library that manages server state
for you** — so you stop writing your own `isLoading`, `errorMessage`,
`setData` boilerplate over and over again, and instead tell react-query *what
data you need* and let it handle the rest.

---

## 🧊 The Real-Life Analogy: The Smart Pantry

Imagine you're a chef running a kitchen. You need ingredients (data) from the
grocery store (the API server).

**Before react-query**, every recipe in your kitchen worked like this:
> "We need tomatoes! Someone run to the store!" — even if you *already bought
> tomatoes yesterday* and they're in the fridge. So you re-buy tomatoes every
> single time a recipe asks for them (duplicate requests!). Nobody writes down
> what you bought, so nobody knows what's in the pantry. And when you buy a
> *new* ingredient, you have to manually walk to every recipe that used the old
> one and update it by hand.

**With react-query**, you get a **Smart Pantry**:
- 🧠 It **remembers what you've already bought** (the cache), so recipes get
  their tomatoes instantly instead of waiting for a new store trip.
- ⏰ It knows when ingredients go **stale** (e.g. the milk is 2 days old) and
  quietly **re-stocks in the background** while the recipe still uses the old
  milk.
- 🏷️ Every shelf has a **label** (the query key). When two recipes ask for
  "cat images", they're handed ingredients from the *same* labelled shelf.
- 🛒 When you **buy a new ingredient** (a mutation), you tell the pantry to
  refresh the shelves that use it — and **every recipe updates automatically**.

You no longer think about *trips to the store*. You just say what you need, and
the pantry handles logistics.

---

## 📋 What's Wrong With Our Current Code (the "before" pain)

Look at our app today. We have written our own tiny, hand-rolled versions of a
pantry in several places, and each one has its own problems:

| File | What it does by hand | The pain |
|---|---|---|
| `hooks/useProfile.ts` | `useState` for `images`, `isLoading`, `errorMessage` + `getProfileImages()` | Every screen that needs images must remember to call `getProfileImages()` and manage 3 pieces of state |
| `context/favourites-context.tsx` | 5 `useState`s: `favouriteImages`, `favouriteImageIds`, `favouriteLoadingImageIds`, `isLoading`, `errorMessage` | Tons of boilerplate; manually duplicating favourites between screens |
| `context/voting-context.tsx` | `Record<string, number>` maps for counts, loading, voting, errors per image | Hand-rolled optimistic updates + rollback logic, easy to get wrong |
| `app/index.tsx` | `useFocusEffect` to re-fetch on every screen visit | Re-downloads everything even if nothing changed — no caching, no smart re-fetching |
| `app/favourites/index.tsx` | `useFocusEffect` to re-fetch on every visit | Same — duplicate network calls every time you switch tabs |

react-query lets us **delete all of this boilerplate** and replace it with a
handful of declarative hooks (`useQuery`, `useMutation`, `useQueryClient`).

---

## 🎓 Lesson 1 — Setting Up react-query

### 🥅 Goal

Get react-query installed and connected to our app, so its "Smart Pantry" is
switched on and available to every screen. We won't migrate any code yet —
this lesson is just about *turning the power on*.

### 🔧 Step 1: Install the library

Run this in the project root:

```bash
npm install @tanstack/react-query
```

### 🏗️ Step 2: Create a `QueryClient` and wrap the app

The two pieces we need:

- **`QueryClient`** — the actual Smart Pantry. It holds the cache, knows about
  stale times, retries, etc. We create **one** for our whole app.
- **`QueryClientProvider`** — a React component that *hands the pantry to every
  room of the kitchen*. It's a React Context Provider under the hood.

For our app, the perfect place is the root layout `app/_layout.tsx`, because it
wraps *everything* (all tabs and screens).

**Before** (`app/_layout.tsx`):

```tsx
export default function RootLayout() {
  const pathname = usePathname();
  const favourites = useFavouritesProviderValue();
  const voting = useVotingProviderValue();
  const isScreenPortrait = useIsScreenPortrait();

  return (
    <IsScreenPortraitContext.Provider value={isScreenPortrait}>
      <FavouritesContext.Provider value={favourites}>
        <VotingContext.Provider value={voting}>
          ...
        </VotingContext.Provider>
      </FavouritesContext.Provider>
    </IsScreenPortraitContext.Provider>
  );
}
```

**After** (`app/_layout.tsx`):

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// One pantry for the whole app. Creating it outside the component means it is
// created once and shared by every screen (not re-created on every re-render).
const queryClient = new QueryClient();

export default function RootLayout() {
  const pathname = usePathname();
  const favourites = useFavouritesProviderValue();
  const voting = useVotingProviderValue();
  const isScreenPortrait = useIsScreenPortrait();

  return (
    // The QueryClientProvider must be the OUTERMOST wrapper, so the pantry is
    // available to every single screen below it.
    <QueryClientProvider client={queryClient}>
      <IsScreenPortraitContext.Provider value={isScreenPortrait}>
        <FavouritesContext.Provider value={favourites}>
          <VotingContext.Provider value={voting}>
            ...
          </VotingContext.Provider>
        </FavouritesContext.Provider>
      </IsScreenPortraitContext.Provider>
    </QueryClientProvider>
  );
}
```

### ✅ How to check it worked

Run the app:

```bash
npm start
```

If it starts without errors, the pantry is switched on. 🎉 We can't *see* it
doing anything yet because no screen asks it for data — that's Lesson 2.

### 🚨 Common Pitfall: Don't create the `QueryClient` inside the component!

We got caught by this on our very first attempt! If you write `new QueryClient()`
inside the component body, React builds a **brand new pantry every time the
component re-renders**. Our `RootLayout` re-renders on every tab switch (it
reads `usePathname()`), so we'd be demolishing and rebuilding the pantry — and
losing all cached groceries — constantly.

**Before (the bug):**

```tsx
export default function RootLayout() {
  const pathname = usePathname();
  const queryClient = new QueryClient(); // ❌ New pantry on every re-render!
  ...
}
```

**After (the fix):**

```tsx
const queryClient = new QueryClient(); // ✅ One pantry for the whole app

export default function RootLayout() {
  const pathname = usePathname();
  ...
}
```

### 🗺️ Roadmap — what's coming next

1. ✅ **Lesson 1** — Setup (`QueryClient` + `QueryClientProvider`)
2. **Lesson 2** — `useQuery`: migrate `useProfile` (fetching the cat images)
3. **Lesson 3** — `useQueryClient` + `useMutation`: migrate `useUploadImage`
4. **Lesson 4** — Query Keys + `invalidateQueries`: migrate the Favourites context
5. **Lesson 5** — Optimistic updates with `useMutation`: migrate the Voting context
6. **Lesson 6** — `staleTime`, `refetchOnFocus`, and deleting `useFocusEffect`
7. **Lesson 7** — Updating our tests to work with react-query

---

## 🎓 Lesson 2 — `useQuery`: Fetching data the lazy way

### 🥅 Goal

Replace the hand-rolled `useProfile` hook (3 `useState`s + a manual fetch
function) with react-query's `useQuery`. The home screen now just *asks the
pantry for cat images* instead of managing the whole store trip itself.

### 🤔 Why are we doing this?

1. **Delete boilerplate.** The old hook is 32 lines of state choreography
   (`setIsLoading`, `setErrorMessage`, `setImages`, `catch`, `finally`...).
   `useQuery` collapses it into one declarative call. Fewer lines = fewer
   places for bugs to hide.
2. **Fetching can't be forgotten.** Before, a screen had to *remember* to call
   `getProfileImages()`. If it forgot, the UI silently showed empty data. With
   `useQuery`, fetching happens automatically on mount — the data is guaranteed
   to be requested.
3. **One shared shelf.** The data lives in the pantry under
   `["profile-images"]`. Any future component that needs the same data grabs it
   from the cache instantly instead of hitting the network again. (We'll see
   this pay off in Lesson 3 when an upload forces this shelf to re-stock.)
4. **One mental model for everything.** Uploads, favourites, votes — they'll
   all follow this same pattern by the end. Learning `useQuery` now means the
   rest of the migration feels like the same idea repeated.

**Why update the tests at the same time?** Because they'd break the moment
`getProfileImages()` disappears — and more importantly, the *test approach*
changes: we now test react-query's **behaviour** (the fetch happens by itself)
instead of our own hand-rolled state logic. The tests get simpler while testing
the real integration.

### 🧠 New Concept #1: Query Keys (the shelf labels)

A **query key** is an array that names a shelf in the pantry. Every time any
component asks for the same key, it gets the *same* shelf (same cached data).

- `["profile-images"]` — the shelf holding our uploaded cat images
- `["favourites"]` — the favourites shelf (Lesson 4)
- `["votes", imageId]` — one shelf *per cat* for votes (Lesson 5)

**Golden rule:** a key must be unique to the data it represents. Same key →
shared shelf. Different key → different shelf.

### 🧠 New Concept #2: `useQuery` (asking the pantry)

`useQuery` is the hook for *reading* data. It needs two things:

```tsx
useQuery({
  queryKey: ["profile-images"], // which shelf?
  queryFn: getUploadedImages    // how to get it if the shelf is empty?
});
```

- **`queryFn`** is any function that returns a Promise of the data. Our
  existing `getUploadedImages` from `api/api.ts` already does this — the API
  layer stays untouched!
- `useQuery` **fetches automatically** when a component that uses it mounts.
  No `useEffect`, no manual `setState`, no "remember to call `getProfileImages()`".
- It returns a state object with everything we used to hand-roll:

| Property | Pantry translation |
|---|---|
| `data` | The ingredient off the shelf. `undefined` until first fetch succeeds. |
| `isPending` | The shelf has *never* been stocked (no data at all yet). |
| `isFetching` | Someone is at the store *right now* (first load or background refetch). |
| `isLoading` | Shorthand for `isPending && isFetching` — the classic "first load spinner". |
| `error` | If the store trip failed, this holds the reason. |
| `refetch()` | A function to *manually* say "please re-stock this shelf". |

### 💻 Code — Before & After

**Before** (`hooks/useProfile.ts`) — 32 lines of hand-rolled state machine:

```tsx
export default function useProfile() {
  const [images, setImages] = useState<[] | CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const getProfileImages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profileImages = await getUploadedImages();
      setImages(profileImages);
      return profileImages;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch profile images";
      setErrorMessage(message);
      setImages([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { images, isLoading, errorMessage, getProfileImages };
}
```

**After** (`hooks/useProfile.ts`) — the pantry does the heavy lifting:

```tsx
import { useQuery } from "@tanstack/react-query";

import getUploadedImages from "@/api/api";

export default function useProfile() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["profile-images"],
    queryFn: getUploadedImages
  });

  // Small helper kept because our API can reject with non-Error values.
  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to fetch profile images"
        : null;

  return {
    images: data ?? [],
    errorMessage,
    isLoading
  };
}
```

**Before** (`app/index.tsx`) — re-downloaded images on every tab visit:

```tsx
useFocusEffect(
  useCallback(() => {
    const loadImagesAndFavourites = async () => {
      await Promise.all([getProfileImages(), loadFavouriteImageIds()]);
    };
    loadImagesAndFavourites();
  }, [getProfileImages, loadFavouriteImageIds])
);
```

**After** (`app/index.tsx`) — images load themselves; favourites stay manual
until Lesson 4:

```tsx
const { images, isLoading, errorMessage } = useProfile();
const {
  favouriteImageIds,
  favouriteLoadingImageIds,
  loadFavouriteImageIds,
  toggleFavourite
} = useFavourites();

// Favourites are still hand-rolled for now (Lesson 4 will fix this).
// Profile images now fetch AUTOMATICALLY via useQuery on first visit.
useFocusEffect(
  useCallback(() => {
    loadFavouriteImageIds();
  }, [loadFavouriteImageIds])
);
```

> 🎉 **The big win:** switching tabs no longer re-downloads the whole kitty
> list. The data lives in the pantry now. (Lesson 6 teaches *when* to let the
> pantry re-stock — that's `staleTime`.)

### 🧪 Tests

`useQuery` needs a `QueryClientProvider` around it, so tests get a small
wrapper. We also switch from "call `getProfileImages()` and wait" to "wait for
the automatic fetch to finish" using `waitFor`. We turn `retry` off so failed
queries don't retry 3 times in tests.

**Before** — called the manual function:

```tsx
const { result } = await renderHook(() => useProfile());
await act(async () => {
  await result.current.getProfileImages();
});
expect(result.current.images).toHaveLength(1);
```

**After** — fresh pantry per test, wait for the auto-fetch:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const { result } = await renderHook(() => useProfile(), {
  wrapper: createWrapper()
});

// No getProfileImages() anymore — useQuery fetches on its own!
await waitFor(() => expect(result.current.images).toHaveLength(1));
```

### 🚨 Common Pitfalls (we hit all of these on the first run!)

1. **`.ts` vs `.tsx` — JSX needs the `x`!** Our test now contains JSX
   (`<QueryClientProvider>`), but the file was named `useProfile.test.ts`.
   TypeScript/Babel treats `.ts` as "no JSX allowed", so the whole file failed
   to parse with a confusing `Unexpected token` error. Renaming it to
   `useProfile.test.tsx` fixed it. Rule: **any file that contains JSX must end
   in `.tsx`**.
2. **`renderHook` is async in @testing-library/react-native v14!** We wrote
   `const { result } = renderHook(...)` and got
   `Cannot read properties of undefined (reading 'current')` — because `result`
   was being destructured from a *Promise*, not the render result. Fix:
   `const { result } = await renderHook(...)`.
3. **`gcTime: Infinity`** — react-query schedules cache-cleanup timers. In
   tests these keep Jest alive ("Jest did not exit one second after the test
   run"). Setting `gcTime: Infinity` on the test client disables them.
4. **Screen integration tests need a pantry too.** Any test that renders a
   screen using `useQuery` must wrap it in `QueryClientProvider` — exactly like
   the real `_layout.tsx` does. We fixed the background-image integration test
   by adding the provider to its `TestWrapper`.
5. **Pre-seed the pantry with `setQueryData` to keep integration tests
   deterministic.** Instead of letting the screen fetch on mount (which causes
   `act()` warnings when the fetch resolves mid-test), we put the data on the
   shelf *before* rendering:

```tsx
queryClient.setQueryData(["profile-images"], []);
```

   Combined with `staleTime: Infinity` (data never goes stale), the query finds
   the shelf already stocked and never fetches at all.

### ✅ How to check it worked

```bash
npx jest hooks/__tests__/useProfile.test.tsx
npm start
```

Home screen: CatLoader on first load, then the kitties. Switching to
Favourites and back no longer triggers a reload flash.

---

## 🎓 Lesson 3 — `useMutation`: Buying a new ingredient (the upload)

### 🥅 Goal

Migrate the upload flow (`hooks/useUploadImage.ts`) from hand-rolled
`isUploading` / `errorMessage` / `try/catch/finally` state to react-query's
`useMutation`. And make two react-query pieces talk to each other for the
first time: after a successful upload, tell the pantry the cat shelf is out of
date so the home screen shows the new kitty.

### 🤔 Why are we doing this?

1. **Uploads are *changes*, not *reads*.** `useQuery` reads server state;
   `useMutation` *changes* it. It hands us `isPending` (the spinner flag),
   `error`, and `onSuccess` for free — goodbye `setIsUploading(true/false)` +
   `try/catch/finally` boilerplate.
2. **The pantry must learn when its shelf is stale.** Right after uploading a
   new cat, the `["profile-images"]` shelf is missing it. We tell the pantry
   "that shelf is out of date" with `invalidateQueries` — and every screen
   using it re-fetches automatically. No manual "call getProfileImages after
   upload" choreography.
3. **Translate once, at the boundary.** Mutations expect failures to *throw*;
   our API returns them as *values* (a string, or `approved: 0`). We wrap
   `uploadImage` and throw an `Error` unless `approved === 1`, so
   `mutation.error` behaves the way react-query expects.

### 🧠 New Concepts

- **`useMutation({ mutationFn, onSuccess })`** — the "purchase" hook.
  `mutate(...)` starts the purchase; `isPending` means in progress; `error`
  holds failures; `onSuccess` fires when the server accepts.
- **`useQueryClient()`** — the hook that hands you the pantry itself so you
  can perform pantry operations (like invalidating shelves).
- **`queryClient.invalidateQueries({ queryKey })`** — "restock the shelf":
  marks cached data as out of date. Active queries with that key re-fetch in
  the background; inactive ones re-fetch on next mount.

### 💻 Code — Before & After

**Before** (`hooks/useUploadImage.ts`) — 62 lines of manual choreography:

```tsx
export default function useUploadImage() {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  const isSubmitBtnDisabled = useMemo(
    () => !image || !!errorMessage || isUploading,
    [image, errorMessage, isUploading]
  );

  const onChangeImage = useCallback((value) => {
    setImage(value);
    setErrorMessage(undefined);
  }, []);

  const uploadSelectedImage = useCallback(async () => {
    if (!image) return false;
    setIsUploading(true);
    setErrorMessage(undefined);
    try {
      const result = await uploadImage({ file: image });
      if (typeof result === "object" && result && result.approved === 1) {
        resetImage();
        return router.push("/");
      }
      setErrorMessage(typeof result === "string" ? result : "Image upload failed");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [image, resetImage]);

  return { errorMessage, image, isSubmitBtnDisabled, isUploading, onChangeImage, resetImage, uploadSelectedImage };
}
```

**After** — the mutation owns the lifecycle:

```tsx
export default function useUploadImage() {
  const queryClient = useQueryClient();
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (asset: ImagePickerAsset) => {
      const result = await uploadImage({ file: asset });
      const isApproved =
        typeof result === "object" && result !== null && result.approved === 1;
      if (!isApproved) {
        throw new Error(typeof result === "string" ? result : "Image upload failed");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-images"] });
      setImage(null);
      router.push("/");
    }
  });

  const resetImage = useCallback(() => setImage(null), []);
  const onChangeImage = useCallback(
    (value: ImagePickerAsset | null) => {
      setImage(value);
      uploadMutation.reset();
    },
    [uploadMutation]
  );
  const uploadSelectedImage = useCallback(() => {
    if (image) uploadMutation.mutate(image);
  }, [image, uploadMutation]);

  const errorMessage = uploadMutation.isError
    ? uploadMutation.error instanceof Error
      ? uploadMutation.error.message
      : "Image upload failed"
    : undefined;

  const isSubmitBtnDisabled = useMemo(
    () => !image || !!errorMessage || uploadMutation.isPending,
    [image, errorMessage, uploadMutation.isPending]
  );

  return { errorMessage, image, isSubmitBtnDisabled, isUploading: uploadMutation.isPending, onChangeImage, resetImage, uploadSelectedImage };
}
```

**`app/upload/index.tsx`:** no changes needed — same return contract. That's
the power of "keep the shape, swap the guts."

### 🧪 Tests

Mutations need a pantry too, so both upload test files gain the `createWrapper`
pattern. And because `mutate()` is fire-and-forget, assertions that read the
mutation's result must wait with `waitFor` instead of asserting immediately
after `uploadSelectedImage()`.

---

## 📖 Glossary

| Term | Meaning |
|---|---|
| **Server state** | Data that lives on the API server (not on the phone). Async, shared, can change without us. |
| **Client state** | Data that lives only on the device (e.g. "is the grid on?"). Managed with `useState`. |
| **QueryClient** | The object that runs the "Smart Pantry": it owns the cache, stale time settings, retries, and re-fetching logic. One per app. |
| **QueryClientProvider** | A React Context Provider that makes the `QueryClient` available to every component below it. |
| **Cache** | The pantry shelf itself — a stored copy of data we've already fetched, so we don't re-download it needlessly. |
| **Query** | A request for *reading* data (e.g. "give me the list of cats"). Wrapped by the `useQuery` hook. |
| **Mutation** | A request that *changes* data on the server (e.g. upload, favourite, vote). Wrapped by the `useMutation` hook. (We'll meet it in Lesson 3.) |
| **queryKey** | The "shelf label" — an array that uniquely names a piece of data in the cache. |
| **queryFn** | The "store trip" — the function that fetches the data. Must return a Promise. |
| **useQuery** | The hook for *reading* server state. Fetches automatically and caches the result under its `queryKey`. |
| **data** | The result `useQuery` hands back once the fetch succeeds. |
| **isPending** | `true` when there is no data yet (the shelf has never been stocked). |
| **isFetching** | `true` whenever a fetch is happening (first load *or* background refetch). |
| **isLoading** | Shorthand for `isPending && isFetching` — the classic "first load spinner" state. |
| **error** | Holds the failure reason if the fetch rejected. |
| **refetch()** | A function from `useQuery` to manually ask the pantry to re-stock a shelf. |
| **waitFor** | A testing-library utility that keeps checking an assertion until it passes or times out — perfect for waiting on async query results. |
| **setQueryData** | A `queryClient` method that stocks a shelf *manually* — used to pre-seed the cache so tests don't have to wait for a fetch. |
| **staleTime** | How old data can be before the pantry considers it "stale" and re-fetches it. (Full lesson in Lesson 6.) |
| **gcTime** | How long the pantry keeps unused shelves before throwing them away. `Infinity` in tests = no cache-cleanup timers. |
| **useMutation** | The hook for *changing* server state (upload, favourite, vote). Gives you `isPending`, `error`, and lifecycle callbacks. |
| **mutationFn** | The "purchase" function — does the actual server change. Must return a Promise. |
| **mutate(vars)** | Starts a mutation. Fire-and-forget (no promise returned) — use `waitFor` in tests to observe the result. |
| **onSuccess** | A mutation lifecycle callback that runs when the server accepts the change. |
| **useQueryClient** | The hook that returns the `QueryClient` (the pantry) so you can invalidate shelves. |
| **invalidateQueries({ queryKey })** | "Restock the shelf" — marks cached data as stale so active queries re-fetch. |
| **reset()** | Clears a mutation back to its untouched state (e.g. forget a previous error). |

## 🔑 Keywords & Terminal Commands

| Keyword / Command | What it means / does |
|---|---|
| `@tanstack/react-query` | The package name for react-query v5 (TanStack is the new name). |
| `npm install @tanstack/react-query` | Installs react-query into the project. |
| `QueryClient` | The class that creates our one-and-only "pantry" object. |
| `new QueryClient()` | Creates the pantry. Do it once, outside the component. |
| `const queryClient = new QueryClient()` at module level | The *only* correct place for it — inside a component, every re-render would create a new pantry and wipe the cache. |
| `useQuery({ queryKey, queryFn })` | The hook that reads server state: name a shelf (`queryKey`) and tell it how to fetch (`queryFn`). |
| `queryKey: ["profile-images"]` | Example of a query key — the label for the "uploaded cat images" shelf. |
| `retry: false` | Test-time option to stop the pantry re-trying failed store trips (default is 3 retries). |
| `npx jest hooks/__tests__/useProfile.test.tsx` | Runs just the `useProfile` test file (note the `.tsx` — JSX requires it!). |
| `queryClient.setQueryData(key, data)` | Manually stock a shelf — used to pre-seed the cache in tests. |
| `renderHook(() => ..., { wrapper })` | Renders a hook in isolation. **Must be awaited** in @testing-library/react-native v14! |
| `gcTime: Infinity` / `staleTime: Infinity` | Test-time query options: no cache-cleanup timers / data never goes stale. |
| `useMutation({ mutationFn, onSuccess })` | Declares a server *change*. `mutate()` fires it, `isPending` = in-flight, `error` = failure. |
| `queryClient.invalidateQueries({ queryKey })` | Tells the pantry a shelf is stale; related queries re-fetch. |
| `useQueryClient()` | Hook that returns the pantry object so components can invalidate/update caches. |
| `QueryClientProvider` | The React component that shares the pantry with the whole app. |
| `client={queryClient}` | The prop that passes our pantry to the provider. |
| `npm start` | Starts the Expo dev server so we can check the app runs. |