"use client";

import React, { useState, useEffect } from "react";
import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

interface UserPreferences {
  darkMode: boolean;
  fontSize: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      document.documentElement.classList.toggle(
        "dark",
        parsedPreferences.darkMode
      );
      document.documentElement.style.fontSize = parsedPreferences.fontSize;
    } else {
      setPreferences({ darkMode: false, fontSize: "medium" });
    }
  }, []);

  useEffect(() => {
    if (preferences) {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      document.documentElement.classList.toggle("dark", preferences.darkMode);
      document.documentElement.style.fontSize = preferences.fontSize;
    }
  }, [preferences]);

  const toggleDarkMode = () => {
    setPreferences((prev) =>
      prev
        ? { ...prev, darkMode: !prev.darkMode }
        : { darkMode: true, fontSize: "medium" }
    );
  };

  const changeFontSize = (size: string) => {
    setPreferences((prev) => ({
      ...prev,
      fontSize: size,
      darkMode: prev?.darkMode ?? false,
    }));
  };

  return (
    <ReduxProvider>
      <html lang="en" className={preferences?.darkMode ? "dark" : ""}>
        <body
          className={`${geistSans.variable} font-sans antialiased bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen`}
        >
          <Navbar
            darkMode={preferences?.darkMode ?? false}
            toggleDarkMode={toggleDarkMode}
            fontSize={preferences?.fontSize ?? "medium"}
            changeFontSize={changeFontSize}
          />
          <main className="container mx-auto md:px-4 md:py-8 px-2 py-4">
            {children}
          </main>
        </body>
      </html>
    </ReduxProvider>
  );
}
