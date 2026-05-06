import { Image } from "expo-image";
import React, { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { IsScreenPortraitContext } from "@/context/screen-orientation-context";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = width < height ? 320 : 250;

const logo = require("../../assets/images/logo/logo.png");

function PurpleHeader() {
  return (
    <View style={styles.container}>
      <Svg
        width={width}
        height={HEADER_HEIGHT}
        viewBox={`0 0 ${width} ${HEADER_HEIGHT}`}
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
            V${HEADER_HEIGHT - 60}

            C${width * 0.85} ${HEADER_HEIGHT - 60},
             ${width * 0.85} ${HEADER_HEIGHT - 30},
             ${width / 1.5} ${HEADER_HEIGHT - 30}

            C${width * 0.25} ${HEADER_HEIGHT - 40},
             ${width * 0.25} ${HEADER_HEIGHT - 90},
             0 ${HEADER_HEIGHT - 10}

            Z
          `}
          fill="url(#grad)"
        />
        <Path
          d={`
            M0 ${HEADER_HEIGHT - 160}
            C40 ${HEADER_HEIGHT - 180}, 60 ${HEADER_HEIGHT - 120}, 80 ${HEADER_HEIGHT - 100}
            C100 ${HEADER_HEIGHT - 80}, 120 ${HEADER_HEIGHT - 120}, 110 ${HEADER_HEIGHT - 60}
            C90 ${HEADER_HEIGHT - 20}, 40 ${HEADER_HEIGHT - 40}, 0 ${HEADER_HEIGHT - 30}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />

        <Path
          d={`
            M${width} ${HEADER_HEIGHT - 170}
            C${width - 40} ${HEADER_HEIGHT - 190}, ${width - 60} ${HEADER_HEIGHT - 130}, ${width - 90} ${HEADER_HEIGHT - 110}
            C${width - 120} ${HEADER_HEIGHT - 90}, ${width - 100} ${HEADER_HEIGHT - 60}, ${width - 110} ${HEADER_HEIGHT - 40}
            C${width - 130} ${HEADER_HEIGHT - 10}, ${width - 50} ${HEADER_HEIGHT - 30}, ${width} ${HEADER_HEIGHT - 20}
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
  return (
    <View style={styles.wrapper}>
      <PurpleHeader />
      <Image
        style={[
          styles.logo,
          {
            top: isScreenPortraitContext ? 0 : 0,
            width: isScreenPortraitContext ? "55%" : "15%"
          }
        ]}
        source={logo}
        contentFit="scale-down"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -120,
    width: "100%",
    zIndex: 3
  },
  logo: {
    aspectRatio: 1,
    zIndex: 3
  },
  wrapper: {
    alignItems: "center",
    height: HEADER_HEIGHT,
    position: "relative",
    width: "100%"
  }
});
