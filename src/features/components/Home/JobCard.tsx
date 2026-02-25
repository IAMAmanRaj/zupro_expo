import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type Job = {
  id: string;
  title: string;
  location: string;
  joiningDate: string;
  mapUrl: string;
  payLabel: string;
};

type JobCardProps = {
  job: Job;
  onApply: () => void;
  onNotInterested: () => void;
  onOpenLocation: () => void;
};

export default function JobCard({
  job,
  onApply,
  onNotInterested,
  onOpenLocation,
}: JobCardProps) {
  return (
    <View className="mb-4 rounded-3xl border border-zinc-200 bg-white p-4">
      <Text className="text-xl font-bold leading-7 text-zinc-900">
        {job.title}
      </Text>

      <View className="mt-3 flex-row items-center">
        <Ionicons color="#2563eb" name="location-sharp" size={18} />
        <Text className="ml-1 text-base font-semibold text-zinc-800">
          {job.location}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center">
        <MaterialIcons color="#71717a" name="calendar-month" size={16} />
        <Text className="ml-1 text-sm text-zinc-600">
          Joining date: {job.joiningDate}
        </Text>
      </View>

      <View className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2">
        <Text className="text-base font-semibold text-emerald-700">
          {job.payLabel}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`See ${job.location} on map`}
        className="mt-3 h-11 flex-row items-center justify-center rounded-2xl border border-blue-200 bg-blue-50"
        onPress={onOpenLocation}
      >
        <Ionicons color="#1d4ed8" name="map" size={16} />
        <Text className="ml-2 text-sm font-semibold text-blue-700">
          See on map
        </Text>
      </Pressable>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Not interested in ${job.title}`}
          className="h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white"
          onPress={onNotInterested}
        >
          <Text className="text-sm font-semibold text-zinc-700">
            Not interested
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Apply for ${job.title}`}
          className="h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600"
          onPress={onApply}
        >
          <Text className="text-base font-semibold text-white">Apply now</Text>
        </Pressable>
      </View>
    </View>
  );
}
