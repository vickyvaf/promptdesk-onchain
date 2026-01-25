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

export const metadata: Metadata = {
  title: "Social Flow - Create Your Content",
  description: "Create your content with AI",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metadata.title,
    description: metadata.description,
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: "https://your-app.com/embed-image",
        button: {
          title: `Launch Social Flow`,
          action: {
            type: "launch_miniapp",
            name: "Social Flow",
            url: "https://your-app.com",
            splashImageUrl: "https://your-app.com/splash-image",
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
