import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleDetail } from "../components/ArticleDetail.tsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";

interface ArticleDetailPageProps {
  articles: any[];
  onArticleView: (articleId: string) => void;
}

export function ArticleDetailPage({
  articles,
  onArticleView,
}: ArticleDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  const article = id ? articles.find((a) => a.id === id) : null;

  // 페이지 제목 설정
  const title = article ? `${article.title} - Feedic` : "Feedic";
  useDocumentTitle(title);

  // 기사를 볼 때 읽음 처리
  useEffect(() => {
    if (id && article) {
      onArticleView(id);
    }
  }, [id, article, onArticleView]);

  // Jazz local-first: 컴포넌트 마운트 시 즉시 초기화
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // 초기화 완료 후 기사가 없고 articles가 존재하면 리다이렉트
  useEffect(() => {
    if (isInitialized && !article && articles.length > 0) {
      // articles가 있지만 해당 기사가 없으면 홈으로
      navigate("/");
    }
  }, [isInitialized, article, articles.length, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  // 아직 초기화되지 않았으면 잠시 대기
  if (!isInitialized) {
    return <div>로딩 중...</div>;
  }

  // 기사가 있으면 표시
  if (article) {
    return <ArticleDetail article={article} onBack={handleBack} />;
  }

  // 기사가 없으면 리다이렉트 중 표시
  return <div>기사를 찾을 수 없습니다...</div>;
}
