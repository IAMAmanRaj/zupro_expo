import { useEffect, useState } from "react";
import { View } from "react-native";
import { HERO_ITEMS } from "../home/constants";
import HomeScreen from "../home/HomeScreen";
import SplashScreen from "../splash/SplashScreen";
import { preloadHeroImages } from "../utils/preLoadImages";

const MIN_SPLASH_DURATION_MS = 2200;

export default function AppBootstrap() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const startBootstrap = async () => {
      const minimumSplashTimer = new Promise((resolve) => {
        setTimeout(resolve, MIN_SPLASH_DURATION_MS);
      });

      await Promise.all([minimumSplashTimer, preloadHeroImages(HERO_ITEMS)]);

      if (!isCancelled) {
        setIsSplashExiting(true);
      }
    };

    void startBootstrap();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
     
      {isSplashVisible ? (
        <View className="flex-1">
          {isSplashExiting ? <HomeScreen /> : null}
          <View className="absolute inset-0">
            <SplashScreen
              isExiting={isSplashExiting}
              onExitComplete={() => setIsSplashVisible(false)}
            />
          </View>
        </View>
      ) : (
        <HomeScreen />
      )}
    </>
  );
}
