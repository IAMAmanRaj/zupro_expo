import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
  locationLabel: string;
  onRefresh: () => void;
  onOpenMap: () => void;
};

export default function Header({
  locationLabel,
  onRefresh,
  onOpenMap,
}: HeaderProps) {
  return (
    <View className="px-5 pb-4 pt-4">
      <View className="mb-4 flex-row items-start justify-between">
        <View>
          <Text className="text-3xl font-bold tracking-tight text-zinc-900">
            Zupro
          </Text>
          <Text className="mt-1 text-sm text-zinc-600">
            Local jobs you can start quickly
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh jobs"
          className="h-11 w-11 items-center justify-center rounded-full bg-zinc-100"
          onPress={onRefresh}
        >
          <Ionicons color="#18181b" name="refresh" size={20} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${locationLabel} in maps`}
        className="flex-row items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3"
        onPress={onOpenMap}
      >
        <View className="flex-row items-center">
          <Ionicons color="#2563eb" name="location-sharp" size={18} />
          <Text className="ml-2 text-sm font-medium text-zinc-800">
            {locationLabel}
          </Text>
        </View>
        <Ionicons color="#71717a" name="chevron-forward" size={16} />
      </Pressable>
    </View>
  );
}
