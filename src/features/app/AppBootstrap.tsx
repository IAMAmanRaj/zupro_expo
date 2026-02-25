import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import HomeScreen from "../home/HomeScreen";
import SplashScreen from "../splash/SplashScreen";

export default function AppBootstrap() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashExiting(true);
    }, 2200);

    return () => clearTimeout(timer);
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
