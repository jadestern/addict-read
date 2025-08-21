import { co, Group } from "jazz-tools";
import { useAccount, useIsAuthenticated } from "jazz-tools/react";
import { useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthButton } from "./AuthButton.tsx";
import { parseRss } from "./api/rssParser.ts";
import { HomePage } from "./pages/HomePage.tsx";
import { ArticleDetailPage } from "./pages/ArticleDetailPage.tsx";
import { useToast } from "./contexts/ToastContext.tsx";
import { JazzAccount, Article as JazzArticle, RSSFeed } from "./schema.ts";

function App() {
	const { me } = useAccount(JazzAccount, {
		resolve: { profile: true, root: { importedFeeds: true } },
	});
	const isAuthenticated = useIsAuthenticated();
	const { showToast } = useToast();
	const navigate = useNavigate();

	// 로딩 상태 관리 (Jazz 데이터는 자동 반응성)
	const [isLoading, setIsLoading] = useState(false);

	// Jazz 데이터를 직접 사용 - 자동 반응성 + 최신순 정렬 + 읽음 상태 포함
	const articles = useMemo(() => {
		if (!me?.root?.importedArticles) return [];
		return me.root.importedArticles
			.filter((article) => article !== null)
			.map((article) => ({
				id: article.id,
				title: article.title,
				link: article.url,
				pubDate: article.pubDate,
				description: article.description,
				isRead: article.isRead,
				jazzArticle: article, // Jazz 객체 직접 참조 (읽음 상태 변경용)
			}))
			.sort(
				(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
			);
	}, [me?.root?.importedArticles]);

	// 구독 추가 처리
	const addSubscription = async (url: string): Promise<boolean> => {
		try {
			if (me?.root) {
				// importedFeeds가 없으면 초기화
				if (!me.root.importedFeeds) {
					const privateGroup = Group.create();
					privateGroup.addMember(me, "writer");
					me.root.importedFeeds = co.list(RSSFeed).create([], privateGroup);
				}

				// 이미 있는 URL인지 확인
				const existingFeed = me.root.importedFeeds.find(
					(feed) => feed?.url === url,
				);
				if (existingFeed) {
					showToast("이미 구독 중인 피드입니다!", "error");
					return false;
				}

				// 새 RSS 피드 추가
				const privateGroup = Group.create();
				privateGroup.addMember(me, "writer");

				const newFeed = RSSFeed.create(
					{
						url: url,
						title: `Feed from ${new URL(url).hostname}`,
						userId: me.id,
					},
					privateGroup,
				);

				me.root.importedFeeds.push(newFeed);
			}

			showToast("구독이 추가되었습니다", "success");
			return true;
		} catch (error) {
			showToast("구독 추가에 실패했습니다", "error");
			return false;
		}
	};

	// RSS 파싱 및 기사 저장
	const parseAndSaveArticles = async (url: string) => {
		setIsLoading(true);
		try {
			const feed = await parseRss(url);

			// Jazz에 기사 저장
			if (me?.root) {
				if (!me.root.importedArticles) {
					const privateGroup = Group.create();
					privateGroup.addMember(me, "writer");
					me.root.importedArticles = co
						.list(JazzArticle)
						.create([], privateGroup);
				}

				// 기사를 Jazz Article 스키마로 변환하여 저장
				for (const article of feed.articles) {
					const privateGroup = Group.create();
					privateGroup.addMember(me, "writer");

					const jazzArticle = JazzArticle.create(
						{
							title: article.title,
							url: article.link,
							feedUrl: url,
							pubDate: article.pubDate,
							description: article.description,
							isRead: false,
							userId: me.id,
						},
						privateGroup,
					);

					me.root.importedArticles.push(jazzArticle);
				}
			}

			// Jazz에 저장하면 useMemo를 통해 자동으로 UI 업데이트됨
		} catch (error) {
			showToast("기사를 불러오는데 실패했습니다", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRssSubmit = async (url: string) => {
		const subscriptionAdded = await addSubscription(url);
		if (subscriptionAdded) {
			await parseAndSaveArticles(url);
		}
	};

	// 피드 삭제 처리
	const handleDeleteFeed = async (feedId: string, feedUrl: string) => {
		try {
			if (me?.root?.importedFeeds) {
				// 피드 삭제
				const feedIndex = me.root.importedFeeds.findIndex(
					(feed) => feed?.id === feedId,
				);
				if (feedIndex !== -1) {
					me.root.importedFeeds.splice(feedIndex, 1);
				}

				// 해당 피드의 기사들도 삭제
				if (me.root.importedArticles) {
					const articlesToRemove = [];
					for (let i = me.root.importedArticles.length - 1; i >= 0; i--) {
						const article = me.root.importedArticles[i];
						if (article?.feedUrl === feedUrl) {
							articlesToRemove.push(i);
						}
					}

					// 뒤에서부터 삭제하여 인덱스 변화 방지
					articlesToRemove.forEach((index) => {
						me.root.importedArticles!.splice(index, 1);
					});
				}
			}

			showToast("피드가 삭제되었습니다", "success");
		} catch (error) {
			showToast("피드 삭제에 실패했습니다", "error");
		}
	};

	// 기사 상세 페이지로 이동
	const handleArticleClick = (articleId: string) => {
		navigate(`/article/${articleId}`);
	};
	
	// 기사 보기 시 읽음 처리 (ArticleDetailPage에서 호출)
	const handleArticleView = (articleId: string) => {
		const article = articles.find(a => a.id === articleId);
		if (article?.jazzArticle && !article.isRead) {
			article.jazzArticle.isRead = true;
		}
	};

	// 전체 기사 읽음 처리
	const handleMarkAllRead = () => {
		if (me?.root?.importedArticles) {
			me.root.importedArticles.forEach(article => {
				if (article && !article.isRead) {
					article.isRead = true;
				}
			});
		}
		showToast("모든 기사가 읽음 처리되었습니다", "success");
	};

	return (
		<>
			<header>
				<nav className="max-w-2xl mx-auto flex justify-between items-center p-3">
					<span>Feedic</span>
					<AuthButton />
				</nav>
			</header>
			<main className="max-w-2xl mx-auto px-3 mt-16 flex flex-col gap-8">
				<Routes>
					<Route 
						path="/" 
						element={
							<HomePage
								articles={articles}
								isLoading={isLoading}
								onRssSubmit={handleRssSubmit}
								onArticleClick={handleArticleClick}
								onMarkAllRead={handleMarkAllRead}
								onDeleteFeed={handleDeleteFeed}
							/>
						} 
					/>
					<Route 
						path="/article/:id" 
						element={
							<ArticleDetailPage
								articles={articles}
								onArticleView={handleArticleView}
							/>
						} 
					/>
				</Routes>
			</main>
		</>
	);
}

export default App;
