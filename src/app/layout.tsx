import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grovy - Your personal library",
  description: "Discover a powerful online productivity platform with seamless file uploads and advanced task management. Streamline your workflow, effortlessly manage to-do lists, and securely upload files. Elevate your productivity with our user-friendly platform designed to simplify rganization. Experience efficient task management and easy file uploading - your all-in-one solution for productivity awaits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <Toaster position="top-center" />
            <Navbar />
            <div className="h-[10vh]"/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
