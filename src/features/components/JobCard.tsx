import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type Job = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  payLabel: string;
  onApply: () => void;
};

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <View className="mb-4 rounded-3xl border border-zinc-200 bg-white p-4">
      <Text className="text-xl font-bold leading-7 text-zinc-900">
        {job.title}
      </Text>

      <View className="mt-3 flex-row items-center">
        <Ionicons color="#2563eb" name="location-sharp" size={16} />
        <Text className="ml-1 text-sm text-zinc-700">{job.location}</Text>
      </View>

      <View className="mt-2 flex-row items-center">
        <MaterialIcons color="#71717a" name="calendar-month" size={16} />
        <Text className="ml-1 text-sm text-zinc-600">
          Starts {job.startDate}
        </Text>
      </View>

      <View className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2">
        <Text className="text-base font-semibold text-emerald-700">
          {job.payLabel}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Apply for ${job.title}`}
        className="mt-4 h-12 items-center justify-center rounded-2xl bg-blue-600"
        onPress={job.onApply}
      >
        <Text className="text-base font-semibold text-white">Apply now</Text>
      </Pressable>
    </View>
  );
}
