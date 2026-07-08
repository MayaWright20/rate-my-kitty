import { Image } from "expo-image";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { Z_INDEX } from "@/constants/styles";
import {
  IsScreenPortraitContext,
  IsScreenPortraitContextProps
} from "@/context/screen-orientation-context";

type Props = {
  isScreenPortrait: IsScreenPortraitContextProps;
  headerHeight: number;
  headerPortraitHeight: number;
  headerHorizontalHeight: number;
};

const { width } = Dimensions.get("window");

const LOGO = require("../../assets/images/logo/logo.png");

function PurpleHeader({
  isScreenPortrait,
  headerHeight,
  headerPortraitHeight,
  headerHorizontalHeight
}: Props) {
  return (
    <View style={styles.container}>
      <Svg
        testID="logo-header-purple-svg"
        width={width}
        height={
          isScreenPortrait ? headerPortraitHeight : headerHorizontalHeight
        }
        viewBox={`0 0 ${width} ${headerHeight}`}
      >
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6B5CF6" />
            <Stop offset="1" stopColor="#4B35D9" />
          </LinearGradient>
        </Defs>
        <Path
          d={`
            M0 0
            H${width}
            V${headerHeight - 60}

            C${width * 0.85} ${headerHeight - 60},
             ${width * 0.85} ${headerHeight - 30},
             ${width / 1.5} ${headerHeight - 30}

            C${width * 0.25} ${headerHeight - 40},
             ${width * 0.25} ${headerHeight - 90},
             0 ${headerHeight - 10}

            Z
          `}
          fill="url(#grad)"
        />
        <Path
          d={`
            M0 ${headerHeight - 160}
            C40 ${headerHeight - 180}, 60 ${headerHeight - 120}, 80 ${headerHeight - 100}
            C100 ${headerHeight - 80}, 120 ${headerHeight - 120}, 110 ${headerHeight - 60}
            C90 ${headerHeight - 20}, 40 ${headerHeight - 40}, 0 ${headerHeight - 30}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />

        <Path
          d={`
            M${width} ${headerHeight - 170}
            C${width - 40} ${headerHeight - 190}, ${width - 60} ${headerHeight - 130}, ${width - 90} ${headerHeight - 110}
            C${width - 120} ${headerHeight - 90}, ${width - 100} ${headerHeight - 60}, ${width - 110} ${headerHeight - 40}
            C${width - 130} ${headerHeight - 10}, ${width - 50} ${headerHeight - 30}, ${width} ${headerHeight - 20}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />
      </Svg>
    </View>
  );
}

export default function LogoHeader() {
  const isScreenPortraitContext = useContext(IsScreenPortraitContext);
  const IMAGE_PORTRAIT_WIDTH = "55%";
  const IMAGE_HORIZONTAL_WIDTH = "15%";
  const HEADER_PORTRAIT_HEIGHT = 320;
  const HEADER_HORIZONTAL_HEIGHT = 250;
  const HEADER_HEIGHT = isScreenPortraitContext
    ? HEADER_PORTRAIT_HEIGHT
    : HEADER_HORIZONTAL_HEIGHT;
  return (
    <View
      testID="logo-header"
      style={[styles.wrapper, { height: HEADER_HEIGHT }]}
    >
      <PurpleHeader
        isScreenPortrait={isScreenPortraitContext}
        headerHeight={HEADER_HEIGHT}
        headerPortraitHeight={HEADER_PORTRAIT_HEIGHT}
        headerHorizontalHeight={HEADER_HORIZONTAL_HEIGHT}
      />
      <Image
        style={[
          styles.logo,
          {
            width: isScreenPortraitContext
              ? IMAGE_PORTRAIT_WIDTH
              : IMAGE_HORIZONTAL_WIDTH
          }
        ]}
        source={LOGO}
        contentFit="scale-down"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -120,
    width: width,
    zIndex: Z_INDEX[3]
  },
  logo: {
    aspectRatio: 1,
    zIndex: Z_INDEX[3]
  },
  wrapper: {
    alignItems: "center",
    position: "relative",
    width: "100%"
  }
});
