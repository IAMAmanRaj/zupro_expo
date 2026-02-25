import { useEffect, useState } from "react";
import HomeScreen from "../home/HomeScreen";
import SplashScreen from "../splash/SplashScreen";

export default function AppBootstrap() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  return <HomeScreen />;
}
