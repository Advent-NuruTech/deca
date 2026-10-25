import type { Metadata } from "next";
import PracticalChristianityPage from "@/components/public/pages/PracticalChristianityPage";

export const metadata: Metadata = {
  title: "Practical Christianity",
  description: "Discover practical, faith-centred pathways for skills, sustainable livelihoods, service, and community transformation.",
};

export default function PracticalChristianity() { return <PracticalChristianityPage />; }
