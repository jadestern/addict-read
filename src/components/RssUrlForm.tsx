import { useState } from "react";

interface RssUrlFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function RssUrlForm({ onSubmit, isLoading = false }: RssUrlFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rss-url" className="block text-sm font-medium text-gray-700 mb-2">
          RSS 피드 URL 입력
        </label>
        <input
          type="url"
          id="rss-url"
          data-testid="rss-url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/feed.xml"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        data-testid="parse-rss-button"
        disabled={isLoading || !url.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "파싱 중..." : "RSS 피드 파싱"}
      </button>
    </form>
  );
}