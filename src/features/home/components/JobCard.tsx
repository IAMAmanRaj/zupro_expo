import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export type Job = {
  id: string;
  title: string;
  location: string;
  joiningDate: string;
  mapUrl: string;
  payLabel: string; // e.g. "₹500/day", "₹15,000/month", "Starts at ₹300/day"
};

type JobCardProps = {
  job: Job;
  onApply: () => void;
  onNotInterested: () => void;
  onOpenLocation: () => void;
};

/**
 * Parses a raw payLabel into a structured display.
 *
 * "₹500/day"           → { prefix: "Daily pay",    amount: "₹500" }
 * "₹15,000/month"      → { prefix: "Monthly pay",  amount: "₹15,000" }
 * "₹3,500/week"        → { prefix: "Weekly pay",   amount: "₹3,500" }
 * "Starts at ₹300/day" → { prefix: "Starting pay", amount: "₹300/day" }
 * Anything else        → { prefix: "",              amount: original }
 */
function parsePay(raw: string): { prefix: string; amount: string } {
  if (/starts?\s+at/i.test(raw)) {
    return { prefix: "Starting pay", amount: raw.replace(/starts?\s+at\s*/i, "").trim() };
  }
  if (/\/day/i.test(raw)) {
    return { prefix: "Daily pay", amount: raw.replace(/\/day/i, "").trim() };
  }
  if (/\/month/i.test(raw)) {
    return { prefix: "Monthly pay", amount: raw.replace(/\/month/i, "").trim() };
  }
  if (/\/week/i.test(raw)) {
    return { prefix: "Weekly pay", amount: raw.replace(/\/week/i, "").trim() };
  }
  return { prefix: "", amount: raw };
}

/** Tiny hook: returns an Animated.Value + pressIn/pressOut handlers */
function useSpringAnim(toValue = 0.96) {
  const anim = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(anim, { toValue, useNativeDriver: true, tension: 280, friction: 10 }).start();
  const pressOut = () =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start();
  return { anim, pressIn, pressOut };
}

export default function JobCard({ job, onApply, onNotInterested, onOpenLocation }: JobCardProps) {
  const card    = useSpringAnim(0.98); // whole-card subtle squeeze
  const applyBtn = useSpringAnim(0.95);
  const skipBtn  = useSpringAnim(0.95);
  const mapBtn   = useSpringAnim(0.97);

  const pay = parsePay(job.payLabel);

  return (
    <Animated.View
      style={{ transform: [{ scale: card.anim }], marginBottom: 16 }}
      onTouchStart={card.pressIn}
      onTouchEnd={card.pressOut}
      onTouchCancel={card.pressOut}
    >
      <View className="rounded-3xl border bg-white border-gray-700 overflow-hidden">

        {/* ── Header ───────────────────────────────────── */}
        <View className="px-5 pt-5 pb-4">
          {/* Title: max 2 lines, ellipsis on overflow */}
          <Text
            className="text-xl font-bold leading-7 text-gray-900"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {job.title}
          </Text>

          <View className="mt-3 flex-row items-center justify-between gap-2">
            {/* Location badge: capped width, truncates cleanly */}
            <View className="flex-row items-center max-w-[55%] rounded-full bg-blue-50 border border-blue-400 px-3 py-1.5">
              <Ionicons color="#2563eb" name="location-sharp" size={14} />
              <Text
                className="ml-1.5 text-md font-semibold text-blue-700 flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {job.location}
              </Text>
            </View>

            {/* Map button */}
            <Animated.View style={{ transform: [{ scale: mapBtn.anim }] }}>
              <Pressable
                onPressIn={mapBtn.pressIn}
                onPressOut={mapBtn.pressOut}
                onPress={onOpenLocation}
                accessibilityRole="button"
                accessibilityLabel={`See ${job.location} on map`}
                className="h-11 w-[80px] flex-row items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white"
              >
                <Ionicons color="#1d4ed8" name="eye-outline" size={20} />
                <Text className="text-md font-semibold text-black">View</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>

        {/* ── Divider ──────────────────────────────────── */}
        <View className="h-px bg-gray-300 mx-5" />

        {/* ── Info chips ───────────────────────────────── */}
        <View className="flex-row gap-3 px-5 pt-4 pb-4">

          {/* Joining date chip */}
          <View className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons color="#9ca3af" name="calendar-month" size={14} />
              <Text className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Joining
              </Text>
            </View>
            <Text
              className="mt-1 text-sm font-semibold text-gray-800"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {job.joiningDate}
            </Text>
          </View>

          {/* Pay chip */}
          <View className="flex-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3">
            <View className="flex-row items-center gap-1.5">
              <Ionicons color="#059669" name="wallet-outline" size={14} />
              <Text className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">
                {pay.prefix || "Pay"}
              </Text>
            </View>
            <Text
              className="mt-1 text-sm font-bold text-emerald-700"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {pay.amount}
            </Text>
          </View>
        </View>

        {/* ── Actions ──────────────────────────────────── */}
        <View className="gap-3 px-5 pb-5">

          {/* Skip + Apply row */}
          <View className="flex-row gap-3">

            {/* Skip */}
            <Animated.View style={{ flex: 1, transform: [{ scale: skipBtn.anim }] }}>
              <Pressable
                onPressIn={skipBtn.pressIn}
                onPressOut={skipBtn.pressOut}
                onPress={onNotInterested}
                accessibilityRole="button"
                accessibilityLabel={`Not interested in ${job.title}`}
                className="h-12 flex-row items-center justify-center gap-1.5 rounded-2xl border border-gray-500 bg-gray-100"
              >
                <Ionicons color="#000000" name="close-circle-outline" size={18} />
                <Text className="text-lg font-semibold text-black">Skip</Text>
              </Pressable>
            </Animated.View>

            {/* Apply */}
            <Animated.View style={{ flex: 1, transform: [{ scale: applyBtn.anim }] }}>
              <Pressable
                onPressIn={applyBtn.pressIn}
                onPressOut={applyBtn.pressOut}
                onPress={onApply}
                accessibilityRole="button"
                accessibilityLabel={`Apply for ${job.title}`}
                className="h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-600"
              >
                <Ionicons color="#ffffff" name="send" size={16} />
                <Text className="text-lg font-bold text-white">Apply</Text>
              </Pressable>
            </Animated.View>
          </View>

        </View>
      </View>
    </Animated.View>
  );
}
