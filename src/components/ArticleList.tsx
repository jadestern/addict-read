import { ParsedArticle } from "../schema";

interface ArticleListProps {
  articles: ParsedArticle[];
  feedTitle?: string;
}

export function ArticleList({ articles, feedTitle }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" data-testid="no-articles">
        아직 기사가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="article-list">
      {feedTitle && (
        <h2 className="text-xl font-bold text-gray-800 mb-4" data-testid="feed-title">
          {feedTitle}
        </h2>
      )}
      <div className="space-y-3">
        {articles.map((article, index) => (
          <ArticleItem key={index} article={article} />
        ))}
      </div>
    </div>
  );
}

interface ArticleItemProps {
  article: ParsedArticle;
}

function ArticleItem({ article }: ArticleItemProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      data-testid="article-item"
    >
      <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
          data-testid="article-link"
        >
          {article.title}
        </a>
      </h3>
      <p className="text-sm text-gray-500" data-testid="article-date">
        {formatDate(article.pubDate)}
      </p>
    </article>
  );
}