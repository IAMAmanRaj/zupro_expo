import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./components/Header";
import JobCard, { type Job } from "./components/JobCard";
import { HERO_ITEMS, INITIAL_JOBS } from "./constants";

const HERO_HEIGHT = 360;
const AUTO_SHIFT_MS = 4500;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<number>);
const REFRESH_DELAY_MS = 900;

function buildJobsFeed(): Job[] {
  return INITIAL_JOBS.map((job) => ({ ...job }));
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isFeedReloading, setIsFeedReloading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(() => buildJobsFeed());
  const [isHoldingHero, setIsHoldingHero] = useState(false);
  const carouselRef = useRef<FlatList<number>>(null);
  const activeIndexRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const isAutoAnimatingRef = useRef(false);
  const autoScrollValue = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const handleRefresh = () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setIsFeedReloading(true);
    setTimeout(() => {
      // Refresh always reloads from source and brings back previously hidden jobs.
      setJobs(buildJobsFeed());
      setIsFeedReloading(false);
      setRefreshing(false);
    }, REFRESH_DELAY_MS);
  };

  const openLocationMap = async (mapUrl: string) => {
    const canOpen = await Linking.canOpenURL(mapUrl);

    if (!canOpen) {
      Alert.alert("Unable to open maps");
      return;
    }

    await Linking.openURL(mapUrl);
  };

  const handleNotInterested = (jobId: string) => {
    setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));
  };

  const handleApply = (jobTitle: string) => {
    Alert.alert("Applied", `Request sent for ${jobTitle}.`);
  };

  const handleSearchSubmit = (_query: string) => {
    // Static input handling only for now.
  };

  const animateToIndex = (index: number) => {
    const targetOffset = index * width;
    isAutoAnimatingRef.current = true;
    autoScrollValue.stopAnimation();
    autoScrollValue.setValue(currentOffsetRef.current);

    Animated.timing(autoScrollValue, {
      toValue: targetOffset,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        activeIndexRef.current = index;
        currentOffsetRef.current = targetOffset;
      }
      isAutoAnimatingRef.current = false;
    });
  };

  useEffect(() => {
    const listenerId = autoScrollValue.addListener(({ value }) => {
      if (!isAutoAnimatingRef.current) {
        return;
      }

      currentOffsetRef.current = value;
      carouselRef.current?.scrollToOffset({
        animated: false,
        offset: value,
      });
    });

    return () => {
      autoScrollValue.removeListener(listenerId);
    };
  }, [autoScrollValue]);

  useEffect(() => {
    if (isHoldingHero || HERO_ITEMS.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % HERO_ITEMS.length;
      animateToIndex(nextIndex);
    }, AUTO_SHIFT_MS);

    return () => clearInterval(timer);
  }, [isHoldingHero, width]);

  return (
    <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <AnimatedFlatList
            data={HERO_ITEMS}
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              index,
              length: width,
              offset: width * index,
            })}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              currentOffsetRef.current = event.nativeEvent.contentOffset.x;
              activeIndexRef.current = nextIndex;
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: true,
                listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                  if (!isAutoAnimatingRef.current) {
                    currentOffsetRef.current = event.nativeEvent.contentOffset.x;
                  }
                },
              },
            )}
            pagingEnabled
            ref={carouselRef}
            renderItem={({ item }) => (
              <Pressable
                onPressIn={() => {
                  isAutoAnimatingRef.current = false;
                  autoScrollValue.stopAnimation();
                  setIsHoldingHero(true);
                }}
                onPressOut={() => setIsHoldingHero(false)}
                style={{ width }}
              >
                <View
                  className="items-center justify-center bg-zinc-900"
                  style={{ height: HERO_HEIGHT, width }}
                >
                  <Image
  source={item}
  contentFit="contain"
  transition={0}          
  cachePolicy="memory-disk"
  priority="high"
  style={{ height: HERO_HEIGHT, width }}
/>
                </View>
              </Pressable>
            )}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
          />

          <View className="absolute bottom-4 w-full flex-row items-center justify-center">
            {HERO_ITEMS.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.45, 1, 0.45],
                extrapolate: "clamp",
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1, 1.3, 1],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  className="mx-1 h-2 w-2 rounded-full bg-white"
                  key={index}
                  style={{ opacity, transform: [{ scale }] }}
                />
              );
            })}
          </View>
        </View>

        <Header
          defaultLocation="Mumbai, Maharashtra"
          onRefresh={handleRefresh}
          onSearchSubmit={handleSearchSubmit}
        />

        <View className="px-5">
          {isFeedReloading ? (
            <View className="mt-6 items-center rounded-2xl border border-zinc-200 bg-white px-4 py-8">
              <ActivityIndicator color="#2563eb" size="small" />
              <Text className="mt-3 text-sm font-medium text-zinc-600">
                Refreshing jobs...
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
