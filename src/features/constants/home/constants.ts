export const HERO_ITEMS = [
  require("../../../../assets/images/Home/hero_gallery/first.png"),
  require("../../../../assets/images/Home/hero_gallery/second.png"),
  require("../../../../assets/images/Home/hero_gallery/third.png"),
];

import { type Job } from "../../components/Home/JobCard";

export const INITIAL_JOBS: Job[] = [
    {
      id: "1",
      title: "Tile Mason",
      location: "Andheri East, Mumbai",
      joiningDate: "26 Feb 2026, 7:00 AM",
      mapUrl: "https://maps.google.com/?q=Andheri+East+Mumbai",
      payLabel: "\u20B91,200 per day",
    },
    {
      id: "2",
      title: "Warehouse Helper",
      location: "Bhiwandi, Thane",
      joiningDate: "26 Feb 2026, 2:30 PM",
      mapUrl: "https://maps.google.com/?q=Bhiwandi+Thane",
      payLabel: "\u20B9900 per shift",
    },
    {
      id: "3",
      title: "House Painter",
      location: "Whitefield, Bengaluru",
      joiningDate: "27 Feb 2026, 8:00 AM",
      mapUrl: "https://maps.google.com/?q=Whitefield+Bengaluru",
      payLabel: "\u20B91,400 per day",
    },
  ];