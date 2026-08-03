import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert } from "react-native";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

import ImageUploader from "../image-uploader";

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn()
}));

function renderWithContext(value: boolean | null, children: React.ReactNode) {
  return render(
    <IsScreenPortraitContext.Provider value={value}>
      {children}
    </IsScreenPortraitContext.Provider>
  );
}

test("should render ImageUploader", async () => {
  const getImage = jest.fn();

  await renderWithContext(true, <ImageUploader getImage={getImage} />);

  const imageUploader = screen.getByTestId("image-uploader");

  expect(imageUploader).toBeOnTheScreen();
});

test("should have correct styling on image-uploader when rendered", async () => {
  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploader = screen.getByTestId("image-uploader");

  const flatStyle = imageUploader.props.style;

  expect(flatStyle).toEqual([
    { alignItems: "center", width: "100%" },
    { maxWidth: "40%" }
  ]);
});

test("should show pressable when rendered", async () => {
  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploaderPressable = screen.getByTestId("image-uploader-pressable");

  const flatStyle = imageUploaderPressable.props.style;

  expect(flatStyle).toEqual([
    {
      alignItems: "center",
      borderRadius: 12,
      borderStyle: "dotted",
      borderWidth: 5,
      justifyContent: "center",
      margin: 5,
      opacity: 0.8
    },
    {
      aspectRatio: 1.3333333333333333,
      backgroundColor: "#E7D9FF",
      borderColor: "#C8B6FF",
      width: "90%"
    }
  ]);
});

test("Shows 'Tap to upload' text when no image is selected", async () => {
  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  expect(screen.getByText("Tap to upload")).toBeOnTheScreen();
});

test("Shows 'Pick your best cat picture!' text when no image is selected", async () => {
  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  expect(screen.getByText("Pick your best cat picture!")).toBeOnTheScreen();
});

test("should show 'Edit photo' after picking an image", async () => {
  // Make the permission request say "yes"
  (
    ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
  ).mockResolvedValue({ granted: true });

  // Make the image picker return a pretend photo
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: "fake-cat-photo.jpg" }]
  });

  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploaderPressable = screen.getByTestId("image-uploader-pressable");

  await act(async () => {
    await fireEvent(imageUploaderPressable, "press");
  });

  expect(screen.getByText("Edit photo")).toBeOnTheScreen();
});

test("should show 'Permission required' if permissions are not granted", async () => {
  // Make the permission request say "no"
  (
    ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
  ).mockResolvedValue({ granted: false });
  const popup = jest.spyOn(Alert, "alert");

  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploaderPressable = screen.getByTestId("image-uploader-pressable");

  await act(async () => {
    await fireEvent(imageUploaderPressable, "press");
  });

  expect(popup).toHaveBeenCalledWith(
    "Permission required",
    "Permission to access the media library is required."
  );
});

test("should call URL.createObjectURL when image has a file property", async () => {
  // Mock URL.createObjectURL to return a fake blob URL
  const mockCreateObjectURL = jest.fn(() => "blob:fake-url-123");
  globalThis.URL.createObjectURL = mockCreateObjectURL;

  // Make the permission request say "yes"
  (
    ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
  ).mockResolvedValue({ granted: true });

  // Make the image picker return a photo WITH a file property
  // This triggers the code path: pickedImage.file && typeof URL !== "undefined"
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: "cat.jpg", file: new File([], "test.jpg") }]
  });

  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploaderPressable = screen.getByTestId("image-uploader-pressable");

  await act(async () => {
    await fireEvent(imageUploaderPressable, "press");
  });

  // Line 67: URL.createObjectURL(pickedImage.file) should have been called
  expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
  // The file object should have been passed to createObjectURL
  expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(File));

  // Line 73: objectUrlRef.current should have been set to the blob URL
  // We can verify this indirectly - getImage should have been called with the picked image
  expect(getImage).toHaveBeenCalledWith(
    expect.objectContaining({ uri: "cat.jpg", file: expect.any(File) })
  );
});

test("should NOT call URL.createObjectURL when image has no file property", async () => {
  // Mock URL.createObjectURL
  const mockCreateObjectURL = jest.fn(() => "blob:fake-url-123");
  globalThis.URL.createObjectURL = mockCreateObjectURL;

  // Make the permission request say "yes"
  (
    ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
  ).mockResolvedValue({ granted: true });

  // Make the image picker return a photo WITHOUT a file property
  // This triggers the code path: just pickedImage.uri (no createObjectURL)
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: "cat.jpg" }]
  });

  const getImage = jest.fn();

  await renderWithContext(
    false,
    <ImageUploader getImage={getImage} resetImages />
  );

  const imageUploaderPressable = screen.getByTestId("image-uploader-pressable");

  await act(async () => {
    await fireEvent(imageUploaderPressable, "press");
  });

  // Line 66-68: Since there's no file property, it should use pickedImage.uri directly
  // URL.createObjectURL should NOT have been called
  expect(mockCreateObjectURL).not.toHaveBeenCalled();

  // getImage should have been called with just the uri (no file)
  expect(getImage).toHaveBeenCalledWith(
    expect.objectContaining({ uri: "cat.jpg" })
  );
});
