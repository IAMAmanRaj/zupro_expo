import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SPLASH_IMAGE } from "../constants/splash/constants";

const ANIMATION = {
  badgeTopOffset: 8,
  exitTranslateX: -420,
  exitDurationMs: 420,
  exitFadeTo: 0,
  overlayOpacity: 0.2,
} as const;

const BADGE_TEXT = "Ab Job milna hoga aasaan !";

type SplashScreenProps = {
  isExiting?: boolean;
  onExitComplete?: () => void;
};

export default function SplashScreen({
  isExiting = false,
  onExitComplete,
}: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isExiting) {
      opacity.value = withTiming(ANIMATION.exitFadeTo, {
        duration: ANIMATION.exitDurationMs,
        easing: Easing.out(Easing.quad),
      });
      translateX.value = withTiming(
        ANIMATION.exitTranslateX,
        {
          duration: ANIMATION.exitDurationMs,
          easing: Easing.inOut(Easing.cubic),
        },
        (finished) => {
          if (finished && onExitComplete) {
            scheduleOnRN(onExitComplete);
          }
        },
      );
    }
  }, [isExiting, onExitComplete, translateX]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View className="flex-1 bg-zinc-950" style={containerAnimatedStyle}>
      <View className="absolute inset-0">
        <Image
          contentFit="cover"
          source={SPLASH_IMAGE}
          style={{ height: "100%", width: "100%" }}
          transition={250}
        />
      </View>

      <View
        className="absolute inset-0 bg-zinc-950"
        pointerEvents="none"
        style={{ opacity: ANIMATION.overlayOpacity }}
      />

      <SafeAreaView className="flex-1 px-6" edges={["top"]}>
        <View style={{ marginTop: insets.top + ANIMATION.badgeTopOffset }}>
          <View
            className="flex-row items-center self-center rounded-full border border-zinc-700/70 bg-zinc-950/60 px-5 py-3"
          >
            <Ionicons color="#60a5fa" name="location" size={24} />
            <Text className="ml-2 text-[20px] font-semibold tracking-wide text-zinc-50">
              {BADGE_TEXT}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
