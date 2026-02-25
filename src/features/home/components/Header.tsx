import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type HeaderProps = {
  defaultLocation: string;
  onRefresh: () => void;
  onSearchSubmit: (query: string) => void;
};

const STEPS = [
  {
    icon: "person-add-outline" as const,
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    label: "Register yourself",
    desc: "Create your free Zupro profile in under 2 minutes.",
  },
  {
    icon: "location-outline" as const,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    border: "#bae6fd",
    label: "Find jobs near you",
    desc: "Browse hundreds of local jobs matched to your area.",
  },
  {
    icon: "briefcase-outline" as const,
    color: "#10b981",
    bg: "#d1fae5",
    border: "#a7f3d0",
    label: "Go & start working",
    desc: "Head to the location and begin earning right away.",
  },
  {
    icon: "trending-up-outline" as const,
    color: "#f59e0b",
    bg: "#fef3c7",
    border: "#fde68a",
    label: "Build profile, grow career",
    desc: "Collect reviews, gain skills, unlock better opportunities.",
  },
];

function useSpring(to = 0.95) {
  const anim = useRef(new Animated.Value(1)).current;
  const inn = () =>
    Animated.spring(anim, { toValue: to, useNativeDriver: true, tension: 260, friction: 10 }).start();
  const out = () =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start();
  return { anim, inn, out };
}

export default function Header({ defaultLocation, onRefresh, onSearchSubmit }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(defaultLocation);
  const [infoVisible, setInfoVisible] = useState(false);

  const infoBtn = useSpring(0.88);
  const closeBtn = useSpring(0.9);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(300)).current;

  const openModal = () => {
    setInfoVisible(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(sheetTranslateY, { toValue: 0, useNativeDriver: true, tension: 180, friction: 18 }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: 300, duration: 220, useNativeDriver: true }),
    ]).start(() => setInfoVisible(false));
  };

  const handleSubmit = () => onSearchSubmit(searchValue.trim());

  return (
    <>
      <View className="px-5 pb-4 pt-4">
        {isSearchExpanded ? (
          <View className="w-full flex-row items-center rounded-2xl border border-zinc-300 bg-white px-3">
            <Ionicons color="#3f3f46" name="search-outline" size={18} />
            <TextInput
              className="h-12 flex-1 px-2 text-base text-zinc-900"
              onChangeText={setSearchValue}
              onSubmitEditing={handleSubmit}
              placeholder="Search by area or city"
              placeholderTextColor="#71717a"
              returnKeyType="search"
              value={searchValue}
              autoFocus
            />
            <Pressable
              accessibilityLabel="Close search"
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-100"
              onPress={() => setIsSearchExpanded(false)}
            >
              <Ionicons color="#3f3f46" name="close-outline" size={18} />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            {/* Left: title + info button */}
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-semibold text-zinc-900">Jobs near you</Text>

              {/* ⓘ button */}
              <Animated.View className="mt-1" style={{ transform: [{ scale: infoBtn.anim }] }}>
                <Pressable
                  accessibilityLabel="How Zupro works"
                  accessibilityRole="button"
                  onPressIn={infoBtn.inn}
                  onPressOut={infoBtn.out}
                  onPress={openModal}
                  className="h-6 w-6 items-center justify-center  rounded-full bg-blue-500 border border-blue-200"
                >
                  <Ionicons color="#ffffff" name="information"  size={13} />
                </Pressable>
              </Animated.View>
            </View>

            {/* Right: refresh + search */}
            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityLabel="Refresh jobs"
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white"
                onPress={onRefresh}
              >
                <Ionicons color="#27272a" name="refresh-outline" size={16} />
              </Pressable>
              <Pressable
                accessibilityLabel="Open search"
                accessibilityRole="button"
                className="h-10 flex-row items-center rounded-xl border border-zinc-200 bg-white px-3 gap-1.5"
                onPress={() => setIsSearchExpanded(true)}
              >
                <Ionicons color="#27272a" name="search-outline" size={16} />
                <Text className="text-sm font-semibold text-zinc-800">Search</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* ── Info modal ─────────────────────────────────── */}
      <Modal visible={infoVisible} transparent animationType="none" onRequestClose={closeModal}>
        {/* Backdrop */}
        <Animated.View
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", opacity: backdropOpacity }}
        >
          <Pressable style={{ flex: 1 }} onPress={closeModal} />
        </Animated.View>

        {/* Bottom sheet */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: sheetTranslateY }],
          }}
        >
          <View className="rounded-t-3xl bg-white px-5 pt-4 pb-8">

            {/* Handle */}
            <View className="mb-4 self-center h-1 w-10 rounded-full bg-zinc-200" />

            {/* Title row */}
            <View className="mb-5 flex-row items-start justify-between">
              <View>
                <Text className="text-xl font-bold text-zinc-900">How Zupro works</Text>
                <Text className="mt-0.5 text-sm text-zinc-500">
                  Find a job in 4 simple steps
                </Text>
              </View>
              <Animated.View style={{ transform: [{ scale: closeBtn.anim }] }}>
                <Pressable
                  onPressIn={closeBtn.inn}
                  onPressOut={closeBtn.out}
                  onPress={closeModal}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                  className="h-9 w-9 items-center justify-center rounded-full bg-zinc-100"
                >
                  <Ionicons color="#52525b" name="close" size={18} />
                </Pressable>
              </Animated.View>
            </View>

            {/* Steps */}
            <View className="gap-3">
              {STEPS.map((step, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-4 rounded-2xl border px-4 py-3"
                  style={{ backgroundColor: step.bg, borderColor: step.border }}
                >
                  {/* Step number + icon */}
                  <View
                    className="h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: step.color + "22" }}
                  >
                    <Ionicons name={step.icon} size={22} color={step.color} />
                  </View>

                  {/* Text */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: step.color }}
                      >
                        Step {i + 1}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-zinc-900">{step.label}</Text>
                    <Text className="text-xs text-zinc-500 mt-0.5">{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* CTA nudge */}
            <View className="mt-5 rounded-2xl bg-blue-600 px-4 py-3 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-white">Ready to find work?</Text>
              <Pressable
                onPress={closeModal}
                className="rounded-xl bg-white px-4 py-2"
                accessibilityRole="button"
                accessibilityLabel="Start browsing jobs"
              >
                <Text className="text-sm font-bold text-blue-600">Browse jobs</Text>
              </Pressable>
            </View>

          </View>
        </Animated.View>
      </Modal>
    </>
  );
}