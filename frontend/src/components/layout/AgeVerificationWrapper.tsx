"use client";

import dynamic from "next/dynamic";

const AgeVerificationModal = dynamic(
  () => import("./AgeVerificationModal").then((mod) => ({ default: mod.AgeVerificationModal })),
  { ssr: false }
);

export function AgeVerificationWrapper() {
  return <AgeVerificationModal />;
}
