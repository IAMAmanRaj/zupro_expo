import { View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-black px-5 pt-16">
      <View className="h-8 w-28 rounded-lg bg-zinc-200" />
      <View className="mt-3 h-4 w-56 rounded-md bg-zinc-200" />

      <View className="mt-8 rounded-3xl border border-zinc-200 bg-white p-4">
        <View className="h-7 w-3/4 rounded-md bg-zinc-200" />
        <View className="mt-4 h-4 w-1/2 rounded-md bg-zinc-200" />
        <View className="mt-2 h-4 w-2/5 rounded-md bg-zinc-200" />
        <View className="mt-4 h-9 w-1/3 rounded-xl bg-emerald-100" />
        <View className="mt-4 h-12 w-full rounded-2xl bg-blue-200" />
      </View>
    </View>
  );
}
