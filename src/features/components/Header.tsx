import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type HeaderProps = {
  defaultLocation: string;
  onSearchSubmit: (query: string) => void;
};

export default function Header({ defaultLocation, onSearchSubmit }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(defaultLocation);

  const handleSubmit = () => {
    onSearchSubmit(searchValue.trim());
  };

  return (
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
          <Text className="text-xl font-semibold text-zinc-900">Jobs near you</Text>
          <Pressable
            accessibilityLabel="Open search"
            accessibilityRole="button"
            className="h-10 flex-row items-center rounded-xl border border-zinc-300 bg-white px-3"
            onPress={() => setIsSearchExpanded(true)}
          >
            <Ionicons color="#27272a" name="search-outline" size={16} />
            <Text className="ml-2 text-sm font-semibold text-zinc-800">Search</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
