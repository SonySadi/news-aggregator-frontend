import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

const UserPreferences: React.FC = () => {
  const { user, updatePreferences, token } = useAuth();
  const router = useRouter();
  const [sources, setSources] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    user?.preferred_sources || []
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    user?.preferred_authors || []
  );

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchSourcesAndAuthors = async () => {
      try {
        const [sourcesResponse, authorsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/sources`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/authors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setSources(sourcesResponse.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error("Error fetching sources and authors:", error);
      }
    };
    fetchSourcesAndAuthors();
  }, [token, user, router]);

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({
        preferred_sources: selectedSources,
        preferred_authors: selectedAuthors,
      });
      alert("Preferences saved successfully!");
      router.push("/"); // Redirect to home page after saving
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Preferred Sources</h3>
        {sources.map((source) => (
          <label key={source} className="block">
            <input
              type="checkbox"
              checked={selectedSources.includes(source)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSources([...selectedSources, source]);
                } else {
                  setSelectedSources(
                    selectedSources.filter((s) => s !== source)
                  );
                }
              }}
            />
            <span className="ml-2">{source}</span>
          </label>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Preferred Authors</h3>
        {authors.map(
          (author) =>
            author && (
              <label key={author} className="block">
                <input
                  type="checkbox"
                  checked={selectedAuthors.includes(author)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAuthors([...selectedAuthors, author]);
                    } else {
                      setSelectedAuthors(
                        selectedAuthors.filter((a) => a !== author)
                      );
                    }
                  }}
                />
                <span className="ml-2">{author}</span>
              </label>
            )
        )}
      </div>
      <button
        onClick={handleSavePreferences}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Preferences
      </button>
    </div>
  );
};

export default UserPreferences;
