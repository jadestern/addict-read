import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArticleDetail } from "../components/ArticleDetail.tsx";

interface ArticleDetailPageProps {
	articles: any[];
	onArticleView: (articleId: string) => void;
}

export function ArticleDetailPage({ articles, onArticleView }: ArticleDetailPageProps) {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const article = id ? articles.find(a => a.id === id) : null;

	// 기사를 볼 때 읽음 처리
	useEffect(() => {
		if (id && article) {
			onArticleView(id);
		}
	}, [id, article, onArticleView]);

	// 기사가 없으면 홈으로 리다이렉트
	if (!article) {
		navigate('/');
		return null;
	}

	const handleBack = () => {
		navigate('/');
	};

	return (
		<ArticleDetail 
			article={article}
			onBack={handleBack}
		/>
	);
}