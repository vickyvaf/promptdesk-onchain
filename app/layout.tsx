import { WalletWatcher } from "@/components/wallet-watcher";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThirdwebProviderWrapper from "../components/ThirdwebProviderWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Social Flow - Create Your Content",
    description: "Create your content with AI",
    other: {
      "base:app_id": "6975dc273a92926b661fd495",
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: "https://dprompt.netlify.app/vercel.svg",
        button: {
          title: `Launch Your Social Flow`,
          action: {
            type: "launch_miniapp",
            name: "Social Flow",
            url: "https://dprompt.netlify.app",
            splashImageUrl: "https://dprompt.netlify.app/vercel.svg",
            splashBackgroundColor: "#000000",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProviderWrapper>
          <WalletWatcher />
          {children}
        </ThirdwebProviderWrapper>
      </body>
    </html>
  );
}
