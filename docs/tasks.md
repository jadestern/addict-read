# Feedic 개발 작업 관리

## 📊 현재 상태: Phase 2 완료 - Mock RSS 파서 구현 단계

**전체 진행률**: 85% (URL 검증 시스템 완료)  
**다음 목표**: Mock RSS 파서 구현 및 기사 목록 표시

---

## ✅ 완료된 작업들

### Phase 1: 기본 인프라 ✅
- ✅ Jazz React 프로젝트 구조 설정
- ✅ TailwindCSS 스타일링 시스템
- ✅ Passkey 인증 시스템
- ✅ E2E 테스트 환경 (Playwright)
- ✅ 유닛 테스트 환경 (Vitest)

### Phase 2: URL 검증 시스템 ✅ 
- ✅ **RSS URL 입력 폼** - 기본 UI 및 검증
- ✅ **토스트 메시지 시스템** - 현대적인 알림 UI
- ✅ **HTTPS 전용 URL 검증** - 보안 강화
- ✅ **브라우저 검증 연동** - 기본 검증과 커스텀 검증 분리
- ✅ **5개 E2E 테스트 통과**:
  1. RSS URL 입력 폼 표시
  2. 유효한 HTTPS URL → 성공 토스트
  3. 유효하지 않은 URL → 브라우저 검증
  4. HTTP URL → 에러 토스트 ("HTTPS URL만 허용됩니다")
  5. 빈 URL → 버튼 비활성화

### Phase 3: 브랜딩 완료 ✅
- ✅ **feedic**으로 앱 이름 변경
- ✅ 모든 UI 텍스트 업데이트
- ✅ 문서 및 README 업데이트

---

## 🎯 다음 단계: Mock RSS 파서 구현

### 1. Mock RSS 파서 및 기사 목록 ⭐️ **[현재 단계]**

**목표**: "RSS 피드 추가 후 기사 목록이 표시되어야 함" E2E 테스트 통과

**현재 활성화된 테스트**:
```typescript
test.skip('RSS 피드 추가 후 기사 목록이 표시되어야 함', async ({ page }) => {
  // 유효한 RSS URL 입력
  await rssUrlInput.fill('https://feeds.feedburner.com/TechCrunch');
  await submitButton.click();

  // 기사 목록 영역이 표시되어야 함
  await expect(page.getByTestId('article-list')).toBeVisible();
  
  // 로딩 상태가 사라지고 기사들이 표시되어야 함
  await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });
  
  // 최소 1개 이상의 기사가 표시되어야 함
  await expect(page.getByTestId('article-item')).toHaveCount(1);
});
```

**구현 계획**:

**1단계: 타입 정의 및 Mock 파서**
```typescript
// src/types/rss.ts
export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
}

export interface ParsedFeed {
  title: string;
  articles: Article[];
}

// src/api/mockRssParser.ts
export const parseMockRss = async (url: string): Promise<ParsedFeed> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const hostname = new URL(url).hostname;
  return {
    title: `${hostname} Feed`,
    articles: Array.from({ length: 3 }, (_, i) => ({
      title: `샘플 기사 ${i + 1} - ${hostname}`,
      link: `${url}/article-${i + 1}`,
      pubDate: new Date(Date.now() - i * 86400000).toISOString(),
      description: `${hostname}의 흥미로운 기사 내용입니다.`
    }))
  };
};
```

**2단계: ArticleList 컴포넌트**
```typescript
// src/components/ArticleList.tsx
interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
}

export function ArticleList({ articles, isLoading }: ArticleListProps) {
  if (isLoading) {
    return <div data-testid="loading">로딩 중...</div>;
  }

  return (
    <div data-testid="article-list">
      {articles.map((article, index) => (
        <article key={index} data-testid="article-item">
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <time>{new Date(article.pubDate).toLocaleDateString()}</time>
        </article>
      ))}
    </div>
  );
}
```

**3단계: App.tsx 통합**
```typescript
// App.tsx 수정
const [articles, setArticles] = useState<Article[]>([]);
const [isLoading, setIsLoading] = useState(false);

const handleRssSubmit = async (url: string) => {
  setIsLoading(true);
  try {
    // 기존 Jazz 저장 로직
    // ...
    
    // Mock RSS 파싱
    const feed = await parseMockRss(url);
    setArticles(prev => [...prev, ...feed.articles]);
    
    showToast('구독이 추가되었습니다', 'success');
  } catch (error) {
    showToast('피드를 불러오는데 실패했습니다', 'error');
  } finally {
    setIsLoading(false);
  }
};
```

**예상 시간**: 2-3시간

---

## 🤔 다음 단계 고민사항

### 현재 아키텍처 검토

**Jazz CoValue vs 로컬 상태**:
- 현재: Jazz에 URL만 저장, 기사는 로컬 상태
- 고려사항: 기사도 Jazz에 저장할 것인가?
- **권장**: 현재는 로컬 상태로 시작, 추후 Jazz 동기화 고려

**Mock vs 실제 RSS 파싱**:
- Mock 장점: 빠른 개발, 안정적 테스트
- 실제 파싱 고려사항: CORS, 서버사이드 필요
- **권장**: Mock으로 UI/UX 완성 후 실제 파싱 단계적 도입

### 다음 우선순위 제안

**Option A: 기능 완성 우선** 🎯 **추천**
1. Mock RSS 파서 + 기사 목록 (현재 단계)
2. 로딩 상태 및 에러 처리
3. 기사 읽기/삭제 기본 기능
4. 실제 RSS 파싱 (Netlify Functions)

**Option B: 실제 기능 우선**
1. 실제 RSS 파서 구현 (서버사이드)
2. CORS 및 프록시 설정
3. 에러 처리 및 재시도

**Option C: UX 개선 우선**
1. 로딩 스켈레톤 UI
2. 기사 카드 디자인 개선
3. 반응형 레이아웃
4. 다크모드 지원

---

## 📋 중장기 로드맵

### Phase 4: 기본 기능 완성 (1-2주)
- ✅ Mock RSS 파서 및 기사 목록
- 🔄 로딩 상태 관리
- ⏳ 기사 읽음/안읽음 상태
- ⏳ 피드 삭제 기능

### Phase 5: 실제 RSS 처리 (2-3주)
- 📡 Netlify Functions RSS 파서
- 🔒 CORS 및 보안 처리
- 📄 다양한 RSS/Atom 포맷 지원
- ⚡ 캐싱 및 성능 최적화

### Phase 6: 고급 기능 (3-4주)
- 🎨 고급 UI/UX (다크모드, 애니메이션)
- 📱 PWA 및 오프라인 지원
- 🔔 실시간 업데이트 및 알림
- 📊 읽기 통계 및 분석

---

**마지막 업데이트**: 2025-08-20  
**다음 세션**: Mock RSS 파서 구현 시작
**현재 E2E 테스트 상태**: 5/7 통과 (다음: 기사 목록 표시)