import type { ParsedFeed } from "../types/rss";

export const parseRss = async (url: string): Promise<ParsedFeed> => {
  try {
    // 개발 환경과 프로덕션 환경 구분
    const baseUrl = import.meta.env.DEV
      ? "http://localhost:8889" // Netlify Dev 서버
      : ""; // 프로덕션에서는 동일 도메인

    const response = await fetch(
      `${baseUrl}/.netlify/functions/rss-parser?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      title: data.title,
      articles: data.articles.map(
        (article: {
          title: string;
          link: string;
          pubDate: string;
          description: string;
          guid: string;
        }) => ({
          title: article.title,
          link: article.link,
          pubDate: article.pubDate,
          description: article.description,
          guid: article.guid,
        })
      ),
    };
  } catch (error) {
    console.error("RSS 파싱 API 호출 실패:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("네트워크 연결을 확인해주세요");
    }

    throw error instanceof Error ? error : new Error("RSS 파싱에 실패했습니다");
  }
};
