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
  const [hasWaitedForData, setHasWaitedForData] = useState(false);

  const article = id ? articles.find((a) => a.id === id) : null;

  // 페이지 제목 설정
  const title = article ? `${article.title} - Feedic` : 
                !hasWaitedForData ? "로딩 중... - Feedic" : "Feedic";
  useDocumentTitle(title);

  // 기사를 볼 때 읽음 처리
  useEffect(() => {
    if (id && article) {
      onArticleView(id);
    }
  }, [id, article, onArticleView]);

  // Jazz 데이터 로딩 완료를 기다리는 로직
  useEffect(() => {
    // 2초 후에는 데이터 로딩 완료로 간주
    const timer = setTimeout(() => {
      setHasWaitedForData(true);
    }, 2000);

    // articles가 로드되면 즉시 완료로 간주
    if (articles.length > 0) {
      setHasWaitedForData(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [articles.length]);

  const handleBack = () => {
    navigate("/");
  };

  // 아직 데이터 로딩 대기 중
  if (!hasWaitedForData) {
    return <div>기사를 불러오는 중...</div>;
  }

  // 데이터 로딩 완료 후 기사가 없으면 리다이렉트
  if (!article) {
    navigate("/");
    return null;
  }

  return <ArticleDetail article={article} onBack={handleBack} />;
}
