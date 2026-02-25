import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StatusBar, Text, View } from "react-native";

const SPLASH_IMAGE = require("../../../assets/images/Splash_Screen/splash_screen_asset.png");

type SplashScreenProps = {
  isExiting?: boolean;
  onExitComplete?: () => void;
};

export default function SplashScreen({
  isExiting = false,
  onExitComplete,
}: SplashScreenProps) {

  const t = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 5600, 
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      { resetBeforeIteration: true },
    );

    anim.start();
    return () => anim.stop();
  }, [t]);

  useEffect(() => {
    if (!isExiting) {
      return;
    }

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onExitComplete?.();
      }
    });
  }, [isExiting, onExitComplete, screenOpacity]);

  const imageScale = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.02, 1.045, 1.02],
  });

  const imageTranslateY = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [3, 0, 3],
  });

  const overlayOpacity = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.26, 0.16, 0.26],
  });

  const badgeScale = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.015, 1],
  });

  const badgeText = useMemo(() => "Ab Job milna hoga aasaan !", []);

  return (
    <Animated.View
      className="flex-1 bg-zinc-950"
      style={{ opacity: screenOpacity }}
    >
      <StatusBar barStyle="light-content" />

      {/* Fullscreen background image */}
      <Animated.View
        className="absolute inset-0"
        style={{
          transform: [
            { scale: imageScale },
            { translateY: imageTranslateY },
          ],
        }}
      >
        <Image
          source={SPLASH_IMAGE}
          contentFit="cover"
          transition={300}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>

      {/* Soft cinematic overlay */}
      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 bg-zinc-950"
        style={{ opacity: overlayOpacity }}
      />

      {/* Top content */}
      <View className="flex-1 absolute top-[55px] left-1/2 -translate-x-1/2 px-6 pb-10">
        <Animated.View
          className="flex-row items-center self-center rounded-full border border-zinc-700/70 bg-zinc-950/60 px-5 py-3"
          style={{
            transform: [{ scale: badgeScale }],
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 12 },
            elevation: 8,
          }}
        >
          <Ionicons color="#60a5fa" name="location" size={24} />
          <Text className="ml-2 text-[20px] font-semibold tracking-wide text-zinc-50">
            {badgeText}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
