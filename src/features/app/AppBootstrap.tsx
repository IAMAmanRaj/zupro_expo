import HomeScreen from "../home/HomeScreen";
import SplashScreen from "../splash/SplashScreen";

export default function AppBootstrap() {
  // TODO: add startup logic (auth, config, fonts, API, etc.)
  const isAppReady = false;

  if (!isAppReady) {
    return <SplashScreen />;
  }

  return <HomeScreen />;
}
