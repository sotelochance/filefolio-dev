import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { dark } from "@clerk/themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileFolio",
  description: "Built with Next.js and Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
            <ShadToaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
