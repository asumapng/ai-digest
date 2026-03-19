import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import StitchesRegistry from "@/lib/StitchesRegistry";
import { globalStyles } from "@/lib/stitches.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Pulse | Daily Intelligence",
  description: "Your daily brief on Analytics, Data Science, and Machine Learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Apply global styles
  globalStyles();

  return (
    <html lang="en">
      <body className={inter.className}>
        <StitchesRegistry>
          {children}
        </StitchesRegistry>
      </body>
    </html>
  );
}
