import React from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import Link from "next/link";

interface NewsArticleProps {
  title: string;
  author: string;
  date: string;
  content: string;
  imageUrl?: string;
  source: string;
  url: string;
}

const NewsArticle: React.FC<NewsArticleProps> = ({
  title,
  author,
  date,
  content,
  imageUrl,
  source,
  url,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <article className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-4 dark:bg-gray-800 dark:border-gray-700">
      {imageUrl && (
        <div className="sm:w-1/3 relative h-48 sm:h-auto">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            unoptimized
            className="transition-opacity duration-300 ease-in-out group-hover:opacity-75"
          />
        </div>
      )}
      <div className="p-6 sm:w-2/3 flex flex-col justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 dark:text-white">
            {title}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>{author}</span> • <time>{formatDate(date)}</time> •{" "}
            <span>{source}</span>
          </div>
          <div
            className="prose max-w-none dark:text-gray-300 mb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="mt-auto">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsArticle;
