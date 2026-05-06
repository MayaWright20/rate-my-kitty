import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 320;
// const HEADER_TOP_OFFSET = -120;
// const VISIBLE_HEADER_HEIGHT = HEADER_HEIGHT + HEADER_TOP_OFFSET;

const logo = require("../../assets/images/logo/logo.png");

function PurpleHeader() {
  const height = HEADER_HEIGHT;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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
            V${height - 60}

            C${width * 0.85} ${height - 60},
             ${width * 0.85} ${height - 30},
             ${width / 1.5} ${height - 30}

            C${width * 0.25} ${height - 40},
             ${width * 0.25} ${height - 90},
             0 ${height - 10}

            Z
          `}
          fill="url(#grad)"
        />
        <Path
          d={`
            M0 ${height - 160}
            C40 ${height - 180}, 60 ${height - 120}, 80 ${height - 100}
            C100 ${height - 80}, 120 ${height - 120}, 110 ${height - 60}
            C90 ${height - 20}, 40 ${height - 40}, 0 ${height - 30}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />

        <Path
          d={`
            M${width} ${height - 170}
            C${width - 40} ${height - 190}, ${width - 60} ${height - 130}, ${width - 90} ${height - 110}
            C${width - 120} ${height - 90}, ${width - 100} ${height - 60}, ${width - 110} ${height - 40}
            C${width - 130} ${height - 10}, ${width - 50} ${height - 30}, ${width} ${height - 20}
            Z
          `}
          fill="rgba(255,255,255,0.08)"
        />
      </Svg>
    </View>
  );
}

export default function LogoHeader() {
  return (
    <View style={styles.wrapper}>
      <PurpleHeader />
      <Image style={styles.logo} source={logo} contentFit="contain" />
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
    alignSelf: "center",
    height: "100%",
    position: "relative",
    top: -55,
    width: "55%",
    zIndex: 3
  },
  safeAreaView: {
    flex: 1
  },
  wrapper: {
    alignItems: "center",
    height: HEADER_HEIGHT,
    position: "relative",
    width: "100%"
  }
});
