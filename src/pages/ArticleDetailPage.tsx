import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "jazz-tools/react";
import { ArticleDetail } from "../components/ArticleDetail.tsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";
import { JazzAccount } from "../schema.ts";

interface ArticleDetailPageProps {
  onArticleView: (articleId: string) => void;
}

export function ArticleDetailPage({ onArticleView }: ArticleDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  const { me } = useAccount(JazzAccount, {
    resolve: {
      profile: true,
      root: {
        importedArticles: true
      }
    },
  });

  const jazzArticle = id && me?.root?.importedArticles
    ? me.root.importedArticles.find((article) => article !== null && article.id === id)
    : null;

  const article = jazzArticle ? {
    id: jazzArticle.id,
    title: jazzArticle.title,
    link: jazzArticle.url,
    pubDate: jazzArticle.pubDate,
    description: jazzArticle.description,
    isRead: jazzArticle.isRead,
    jazzArticle: jazzArticle,
  } : null;


  const title = article ? `${article.title} - Feedic` : "Feedic";
  useDocumentTitle(title);

  useEffect(() => {
    if (id && article) {
      onArticleView(id);
    }
  }, [id, article, onArticleView]);

  useEffect(() => {
    if (hasRedirected.current || jazzArticle) return;

    const hasFullyLoadedData = me?.root?.importedArticles
      && me.root.importedArticles.length > 0;

    if (hasFullyLoadedData && !jazzArticle && id) {
      const timer = setTimeout(() => {
        if (!jazzArticle) {
          hasRedirected.current = true;
          navigate("/");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [me?.root?.importedArticles, jazzArticle, id, navigate]);

  useEffect(() => {
    hasRedirected.current = false;
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  if (!me?.root?.importedArticles) {
    return <div>로딩 중...</div>;
  }

  if (article) {
    return <ArticleDetail article={article} onBack={handleBack} />;
  }

  return <div>기사를 찾을 수 없습니다...</div>;
}
