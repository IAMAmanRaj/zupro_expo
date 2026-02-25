import { useCallback, useMemo, useState } from "react";
import { Alert, Linking, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import JobCard, { type Job } from "../components/JobCard";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const jobs = useMemo<Job[]>(
    () => [
      {
        id: "1",
        title: "Tile Mason",
        location: "Andheri East, Mumbai",
        startDate: "Tomorrow, 7:00 AM",
        payLabel: "₹1,200 per day",
        onApply: () => Alert.alert("Applied", "Request sent to employer."),
      },
      {
        id: "2",
        title: "Warehouse Helper",
        location: "Bhiwandi, Thane",
        startDate: "Today, 2:30 PM",
        payLabel: "₹900 per shift",
        onApply: () => Alert.alert("Applied", "Request sent to employer."),
      },
      {
        id: "3",
        title: "House Painter",
        location: "Whitefield, Bengaluru",
        startDate: "Friday, 8:00 AM",
        payLabel: "₹1,400 per day",
        onApply: () => Alert.alert("Applied", "Request sent to employer."),
      },
    ],
    [],
  );

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
            <JobCard job={job} key={job.id} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
