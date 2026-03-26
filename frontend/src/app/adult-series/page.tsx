import type { Metadata } from "next";
import { generateAdultSeriesMetadata } from "@/lib/metadata";
import AdultSeriesContent from "./adult-series-content";

export const metadata: Metadata = generateAdultSeriesMetadata();

export default AdultSeriesContent;
