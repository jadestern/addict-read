import Parser from "rss-parser";

export default async (req: Request): Promise<Response> => {
  // CORS 헤더 설정
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // URL 파라미터에서 RSS URL 가져오기
    const url = new URL(req.url);
    const rssUrl = url.searchParams.get("url");

    if (!rssUrl) {
      return new Response(JSON.stringify({ error: "RSS URL이 필요합니다" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // RSS 파싱
    const parser = new Parser({
      timeout: 10000, // 10초 타임아웃
      headers: {
        "User-Agent": "Feedic RSS Reader/1.0",
      },
    });

    const feed = await parser.parseURL(rssUrl);

    // 응답 데이터 구조화
    const response = {
      title: feed.title || "Unknown Feed",
      description: feed.description || "",
      articles: feed.items.slice(0, 20).map((item) => ({
        title: item.title || "Untitled",
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.contentSnippet || item.content || "",
        guid: item.guid || item.link || "",
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("RSS 파싱 에러:", error);

    return new Response(
      JSON.stringify({
        error: "RSS 파싱에 실패했습니다",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};
