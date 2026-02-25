import { useCallback, useState } from "react";
import { Alert, Linking, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import JobCard, { type Job } from "../components/JobCard";
import { INITIAL_JOBS } from "../constants/jobs";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const openMap = useCallback(async () => {
    const url = "https://maps.google.com/?q=Mumbai+India";
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert("Unable to open maps");
      return;
    }

    await Linking.openURL(url);
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

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Header
          locationLabel="Nearby in Mumbai"
          onOpenMap={openMap}
          onRefresh={handleRefresh}
        />

        <View className="px-5">
          <Text className="mb-4 text-sm text-zinc-600">
            One-tap applications for verified nearby work.
          </Text>

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
