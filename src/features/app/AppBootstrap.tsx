import { useEffect, useState } from "react";
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

  if (isSplashVisible) {
    return (
      <SplashScreen
        isExiting={isSplashExiting}
        onExitComplete={() => setIsSplashVisible(false)}
      />
    );
  }

  return <HomeScreen />;
}
