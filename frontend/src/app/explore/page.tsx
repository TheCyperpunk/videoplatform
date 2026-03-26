import type { Metadata } from "next";
import { generateExploreMetadata } from "@/lib/metadata";
import ExplorePageWrapper from "./explore-content";

export const metadata: Metadata = generateExploreMetadata();

export default ExplorePageWrapper;
