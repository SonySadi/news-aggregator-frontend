"use client";

import React from "react";
import NewsList from "../components/NewsList";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsList />
    </div>
  );
}
