"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../hooks/auth";
import { useAppSelector } from "@/hooks/redux";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  changeFontSize: (size: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  fontSize,
  changeFontSize,
}) => {
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              News Aggregator
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <select
              value={fontSize}
              onChange={(e) => changeFontSize(e.target.value)}
              className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            {user ? (
              <>
                <Link
                  href="/preferences"
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Preferences
                </Link>
                <button
                  onClick={logout}
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
