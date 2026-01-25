"use client";

import { ThirdwebProvider, AutoConnect } from "thirdweb/react";
import { client } from "@/lib/client";
import { baseSepolia } from "thirdweb/chains";

export default function ThirdwebProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider>
      <AutoConnect client={client} chain={baseSepolia} />
      {children}
    </ThirdwebProvider>
  );
}
