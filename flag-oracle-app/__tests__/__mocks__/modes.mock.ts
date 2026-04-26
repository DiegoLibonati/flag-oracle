import type { Mode } from "@/types/app";

export const mockModes: Mode[] = [
  {
    _id: "672687090bcd13f7c9a88ac3",
    description: "You must guess the most available flags in 90 seconds.",
    multiplier: 10,
    name: "Normal",
    timeleft: 90,
  },
  {
    _id: "6726874dde5266d8ba53ae77",
    description: "You must guess the most available flags in 60 seconds.",
    multiplier: 25,
    name: "Hard",
    timeleft: 60,
  },
  {
    _id: "67268757de5266d8ba53ae78",
    description: "You must guess the most available flags in 25 seconds.",
    multiplier: 100,
    name: "Hardcore",
    timeleft: 25,
  },
];

export const mockMode = mockModes[0]!;
