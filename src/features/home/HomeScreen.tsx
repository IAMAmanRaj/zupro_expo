import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import JobCard, { type Job } from "../components/JobCard";
import { INITIAL_JOBS } from "../constants/jobs";

const HERO_IMAGES = [
  require("../../../assets/images/Home/hero_gallery/asset_1.png"),
  require("../../../assets/images/Home/hero_gallery/asset_2.png"),
  require("../../../assets/images/Home/hero_gallery/asset_3.png"),
];

const HERO_AUTOPLAY_INTERVAL_MS = 5000;
const HERO_HEIGHT = 280;

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroHeld, setIsHeroHeld] = useState(false);
  const heroListRef = useRef<FlatList<(typeof HERO_IMAGES)[number]>>(null);
  const { width } = useWindowDimensions();

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const openLocationMap = useCallback(async (mapUrl: string) => {
    const canOpen = await Linking.canOpenURL(mapUrl);

    if (!canOpen) {
      Alert.alert("Unable to open maps");
      return;
    }

    await Linking.openURL(mapUrl);
  }, []);

  const handleNotInterested = useCallback((jobId: string) => {
    setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));
  }, []);

  const handleApply = useCallback((jobTitle: string) => {
    Alert.alert("Applied", `Request sent for ${jobTitle}.`);
  }, []);

  const handleSearchSubmit = useCallback((_query: string) => {
    // Static input handling only for now. API fetch will be connected later.
  }, []);

  useEffect(() => {
    if (isHeroHeld || HERO_IMAGES.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      const nextIndex = (activeHeroIndex + 1) % HERO_IMAGES.length;
      heroListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
      setActiveHeroIndex(nextIndex);
    }, HERO_AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [activeHeroIndex, isHeroHeld]);

  return (
    <SafeAreaView className="flex-1 bg-stone-50" edges={["left", "right", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <FlatList
            data={HERO_IMAGES}
            getItemLayout={(_, index) => ({
              index,
              length: width,
              offset: width * index,
            })}
            horizontal
            keyExtractor={(_, index) => `${index}`}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveHeroIndex(nextIndex);
            }}
            pagingEnabled
            ref={heroListRef}
            renderItem={({ item }) => (
              <Pressable
                onPressIn={() => setIsHeroHeld(true)}
                onPressOut={() => setIsHeroHeld(false)}
                style={{ width }}
              >
                <Image contentFit="cover" source={item} style={{ height: HERO_HEIGHT, width }} />
              </Pressable>
            )}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          />

          <View className="absolute bottom-4 w-full flex-row items-center justify-center">
            {HERO_IMAGES.map((_, index) => (
              <View
                className={`mx-1 h-2 w-2 rounded-full ${
                  index === activeHeroIndex ? "bg-white" : "bg-white/50"
                }`}
                key={index}
              />
            ))}
          </View>
        </View>

        <Header defaultLocation="Mumbai, Maharashtra" onSearchSubmit={handleSearchSubmit} />

        <View className="px-5">
          {jobs.map((job) => (
            <JobCard
              job={job}
              key={job.id}
              onApply={() => handleApply(job.title)}
              onNotInterested={() => handleNotInterested(job.id)}
              onOpenLocation={() => openLocationMap(job.mapUrl)}
            />
          ))}

          {jobs.length === 0 ? (
            <View className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4">
              <Text className="text-base font-medium text-zinc-800">
                No more jobs in this feed.
              </Text>
              <Text className="mt-1 text-sm text-zinc-600">
                Pull to refresh to check for new postings.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
