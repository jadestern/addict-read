import type { LocalFeed } from "../schema";

interface FeedListProps {
	feeds: (LocalFeed | null)[];
	onDeleteFeed: (feedId: string, feedUrl: string) => void;
}

export function FeedList({ feeds, onDeleteFeed }: FeedListProps) {
	if (!feeds || feeds.length === 0) {
		return null;
	}

	return (
		<div className="mt-4 p-4 bg-gray-100 rounded-md">
			<h3 className="font-medium mb-2">구독 중인 피드:</h3>
			<ul className="space-y-2">
				{feeds.map((feed, index) => (
					<li
						key={index}
						className="flex items-center justify-between text-sm bg-white p-3 rounded border"
					>
						<div>
							<span className="font-medium block">{feed?.title}</span>
							<span className="text-gray-600 text-xs">{feed?.url}</span>
						</div>
						<button
							onClick={() => feed && onDeleteFeed(feed.id, feed.url)}
							className="text-red-600 hover:text-red-800 text-xs px-2 py-1 hover:bg-red-50 rounded transition-colors"
							data-testid={`delete-feed-${index}`}
							title="피드 삭제"
						>
							삭제
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
