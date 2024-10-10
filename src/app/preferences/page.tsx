"use client";

import React from "react";
import UserPreferences from "../../components/UserPreferences";

const PreferencesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserPreferences />
    </div>
  );
};

export default PreferencesPage;
