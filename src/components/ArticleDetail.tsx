import type { Article } from "../types/rss";

interface ExtendedArticle extends Article {
	id: string;
	isRead: boolean;
}

interface ArticleDetailProps {
	article: ExtendedArticle;
	onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
	return (
		<div data-testid="article-detail" className="space-y-6">
			{/* 뒤로가기 버튼 */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={onBack}
					data-testid="back-button"
					className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
				>
					← 목록으로 돌아가기
				</button>
				<span className="text-xs text-gray-500 px-3 py-1 bg-green-100 rounded-full">
					읽음
				</span>
			</div>

			{/* 기사 제목 */}
			<header>
				<h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
					{article.title}
				</h1>
			</header>

			{/* 기사 메타데이터 */}
			<div className="flex flex-col gap-2 pb-4 border-b border-gray-200">
				<time 
					dateTime={article.pubDate}
					className="text-sm text-gray-600"
				>
					{new Date(article.pubDate).toLocaleDateString("ko-KR", {
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</time>
				
				<a
					href={article.link}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
				>
					원문 보기 🔗
				</a>
			</div>

			{/* 기사 내용 */}
			<main className="prose prose-gray max-w-none">
				{article.description ? (
					<div 
						className="text-gray-700 leading-relaxed whitespace-pre-line"
						dangerouslySetInnerHTML={{ __html: article.description }}
					/>
				) : (
					<div className="text-center py-8 text-gray-500">
						<p>기사 내용을 불러올 수 없습니다.</p>
						<a
							href={article.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						>
							원문에서 읽기 🔗
						</a>
					</div>
				)}
			</main>
		</div>
	);
}