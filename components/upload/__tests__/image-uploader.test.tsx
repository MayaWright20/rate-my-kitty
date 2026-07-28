import { render, screen } from "@testing-library/react-native";
import React from "react";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

import ImageUploader from "../image-uploader";

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

  const imageUploader = screen.getByTestId("image-uploader-pressable");

  const flatStyle = imageUploader.props.style;

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
