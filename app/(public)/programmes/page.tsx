import type { Metadata } from "next";
import CataloguePage from "@/components/public/pages/CataloguePage";
export const metadata: Metadata = { title: "KJSEA Catalogue", description: "Browse KJSEA revision books and quantity pricing from Deca Bookstore." };
export default function Page() { return <CataloguePage />; }
