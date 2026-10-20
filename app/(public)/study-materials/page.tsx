import type { Metadata } from "next";
import StudyMaterialsPage from "@/components/public/pages/StudyMaterialsPage";

export const metadata: Metadata = {
  title: "Study Materials | RemSam Homestead",
  description: "Download free study materials, guides, and resources for faith and learning.",
};

export default function Page() {
  return <StudyMaterialsPage />;
}
