import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NewsArticle from "./NewsArticle";
import { useAuth } from "../hooks/auth";

interface Article {
  id: number;
  title: string;
  author: string;
  published_at: string;
  abstract: string;
  url_to_image: string;
  section_name: string;
  source_name: string;
  url: string; // Add this new prop for the original article URL
}

interface FilterOptions {
  search: string;
  startDate: string;
  endDate: string;
  source: string;
}

const NewsList: React.FC = () => {
  const { token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    startDate: "",
    endDate: "",
    source: "",
  });
  const [sources, setSources] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = useCallback(async () => {
    try {
      const filledFilterOptions = Object.entries(filterOptions).reduce(
        (acc, [key, value]) => {
          if (value !== "") {
            acc[key as keyof FilterOptions] = value;
          }
          return acc;
        },
        {} as Partial<FilterOptions>
      );

      const config = {
        params: {
          ...filledFilterOptions,
          page: currentPage,
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
        config
      );

      setArticles(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, [filterOptions, currentPage, token]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sources`
      );
      setSources(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search articles..."
          value={filterOptions.search}
          onChange={handleFilterChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            name="startDate"
            value={filterOptions.startDate}
            onChange={handleFilterChange}
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="date"
            name="endDate"
            value={filterOptions.endDate}
            onChange={handleFilterChange}
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            name="source"
            value={filterOptions.source}
            onChange={handleFilterChange}
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>
      {articles.map((article) => (
        <NewsArticle
          key={article.id}
          title={article.title}
          author={article.author}
          date={article.published_at}
          content={article.abstract}
          imageUrl={article.url_to_image}
          source={article.source_name}
          url={article.url} // Add this line
        />
      ))}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsList;
