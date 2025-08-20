import { ParsedFeed } from '../types/rss';

export const parseMockRss = async (url: string): Promise<ParsedFeed> => {
  // 실제 RSS 파싱 로딩 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 에러 테스트용 URL 처리
  if (url.includes('invalid-rss-feed.com/error')) {
    throw new Error('RSS 파싱 실패 - 잘못된 피드 형식');
  }

  const hostname = new URL(url).hostname;

  // Mock 기사 데이터 생성
  const mockArticles = Array.from({ length: 3 }, (_, i) => ({
    title: `샘플 기사 ${i + 1} - ${hostname}`,
    link: `${url}/article-${i + 1}`,
    pubDate: new Date(Date.now() - i * 86400000).toISOString(), // 하루씩 이전 날짜
    description: `${hostname}에서 제공하는 흥미로운 기사 내용입니다. 이것은 Mock 데이터로 실제 RSS 파싱이 구현되기 전까지 사용됩니다.`
  }));

  return {
    title: `${hostname} Feed`,
    articles: mockArticles
  };
};