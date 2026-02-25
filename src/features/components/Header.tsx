import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";

type HeaderProps = {
  defaultLocation: string;
  onSearchSubmit: (query: string) => void;
};

export default function Header({ defaultLocation, onSearchSubmit }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(defaultLocation);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const submitSearch = () => {
    onSearchSubmit(searchQuery.trim());
  };

  const openSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchOpen(false);
  };

  return (
    <View className="px-5 pb-3 pt-4">
      <Text className="text-3xl font-bold tracking-tight text-zinc-900">Zupro</Text>
      <Text className="mt-1 text-sm text-zinc-600">
        Local jobs you can start quickly
      </Text>

      <View className="mt-4">
        {isSearchOpen ? (
          <View className="w-full flex-row items-center rounded-2xl border border-zinc-300 bg-white px-3">
            <Ionicons color="#3f3f46" name="search-outline" size={18} />
            <TextInput
              className="h-12 flex-1 px-2 text-base text-zinc-900"
              onChangeText={setSearchQuery}
              onSubmitEditing={submitSearch}
              placeholder="Search by area or city"
              placeholderTextColor="#71717a"
              returnKeyType="search"
              value={searchQuery}
            />
            <Pressable
              accessibilityLabel="Close search"
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-100"
              onPress={closeSearch}
            >
              <Ionicons color="#3f3f46" name="close-outline" size={18} />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-zinc-900">
              Jobs near you
            </Text>
            <Pressable
              accessibilityLabel="Open search"
              accessibilityRole="button"
              className="h-10 flex-row items-center rounded-xl border border-zinc-300 bg-white px-3"
              onPress={openSearch}
            >
              <Ionicons color="#27272a" name="search-outline" size={16} />
              <Text className="ml-2 text-sm font-semibold text-zinc-800">
                Search
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
