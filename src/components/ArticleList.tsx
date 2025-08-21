import type { Article } from "../types/rss";

interface ExtendedArticle extends Article {
	id: string;
	isRead: boolean;
}

interface ArticleListProps {
	articles: ExtendedArticle[];
	isLoading: boolean;
	onArticleClick: (articleId: string) => void;
	onMarkAllRead: () => void;
}

export function ArticleList({ articles, isLoading, onArticleClick, onMarkAllRead }: ArticleListProps) {
	if (isLoading) {
		return (
			<div
				data-testid="loading"
				className="flex items-center justify-center p-8"
			>
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<p className="text-gray-600">로딩 중...</p>
				</div>
			</div>
		);
	}

	if (articles.length === 0) {
		return (
			<div data-testid="article-list" className="text-center p-8 text-gray-500">
				<p>아직 구독된 피드가 없습니다.</p>
				<p className="text-sm mt-1">
					RSS URL을 입력해서 피드를 구독해보세요!
				</p>
			</div>
		);
	}

	return (
		<div data-testid="article-list" className="space-y-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-gray-800">최신 기사</h2>
				{articles.length > 0 && articles.some(a => !a.isRead) && (
					<button
						onClick={onMarkAllRead}
						data-testid="mark-all-read-button"
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						모두 읽음
					</button>
				)}
			</div>
			{articles.map((article, index) => (
				<article
					key={`${article.link}-${index}`}
					data-testid="article-item"
					className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${
						article.isRead ? 'read opacity-60 bg-gray-50' : 'unread opacity-100'
					}`}
				>
					<h3 className="font-medium text-gray-900 mb-2">
						<a
							href={article.link}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 transition-colors"
							onClick={() => onArticleClick(article.id)}
						>
							{article.title}
						</a>
					</h3>

					{article.description && (
						<p className="text-gray-600 text-sm mb-3 line-clamp-2">
							{article.description}
						</p>
					)}

					<div className="flex items-center justify-between text-xs text-gray-500">
						<time dateTime={article.pubDate}>
							{new Date(article.pubDate).toLocaleDateString("ko-KR", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</time>
						<span className="text-blue-600 hover:underline">외부 링크 →</span>
					</div>
				</article>
			))}
		</div>
	);
}
