import { useAccount, useIsAuthenticated } from "jazz-tools/react";
import { useState } from "react";
import { ArticleList } from "../components/ArticleList.tsx";
import { FeedList } from "../components/FeedList.tsx";
import { RssUrlForm } from "../components/RssUrlForm.tsx";
import { JazzAccount } from "../schema.ts";

interface HomePageProps {
	articles: any[];
	isLoading: boolean;
	onRssSubmit: (url: string) => Promise<void>;
	onArticleClick: (articleId: string) => void;
	onMarkAllRead: () => void;
	onDeleteFeed: (feedId: string, feedUrl: string) => Promise<void>;
}

export function HomePage({ 
	articles, 
	isLoading, 
	onRssSubmit, 
	onArticleClick, 
	onMarkAllRead,
	onDeleteFeed 
}: HomePageProps) {
	const { me } = useAccount(JazzAccount, {
		resolve: { profile: true, root: { importedFeeds: true } },
	});
	const isAuthenticated = useIsAuthenticated();

	return (
		<>
			<div className="text-center">
				{/* 기사가 없을 때만 메인 타이틀 표시 (헤더와 중복 방지) */}
				{articles.length === 0 && <h1>Feedic</h1>}
				{/* 기사가 없을 때만 앱 설명 표시 */}
				{articles.length === 0 && (
					<p>RSS 피드를 구독하고 최신 기사를 확인하세요</p>
				)}
				{isAuthenticated && me?.profile?.firstName && (
					<p className="text-sm text-gray-600">
						안녕하세요, {me.profile.firstName}님!
					</p>
				)}
			</div>

			<ArticleList 
				articles={articles} 
				isLoading={isLoading}
				onArticleClick={onArticleClick}
				onMarkAllRead={onMarkAllRead}
			/>

			<RssUrlForm onSubmit={onRssSubmit} isLoading={isLoading} />

			<FeedList
				feeds={me?.root?.importedFeeds || []}
				onDeleteFeed={onDeleteFeed}
			/>
		</>
	);
}