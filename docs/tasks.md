# RSS Reader 개발 작업 관리

## 📊 현재 상태: TDD 2단계 (URL 검증 구현)

**전체 진행률**: 60% (Jazz 통합 완료)  
**다음 목표**: 두 번째 E2E 테스트 통과 (URL 검증 및 성공 메시지)

---

## 🎯 즉시 해야 할 작업

### 1. URL 검증 및 성공 메시지 구현 ⭐️ **[다음 단계]**

**목표**: "유효한 RSS URL 입력 시 성공 메시지가 표시되어야 함" E2E 테스트 통과

**현재 상태**:
- ✅ RSS URL 입력 폼 존재 (첫 번째 E2E 테스트 통과)
- ✅ Jazz CoValue에 URL 저장 기능
- ✅ `rssValidator` 유닛 테스트 10개 모두 통과
- ❌ 폼에서 URL 검증 로직 미사용
- ❌ 성공/에러 메시지 UI 없음

**구체적 작업**:
```typescript
// 1. RssUrlForm.tsx 수정
- import { isValidUrl } from '../utils/rssValidator'
- useState로 메시지 상태 관리 추가
- 제출 전 URL 검증 로직 적용
- 성공/에러 메시지 조건부 렌더링

// 2. ErrorMessage.tsx 활용
- 성공 메시지와 에러 메시지 통일된 UI

// 3. E2E 테스트 활성화
- e2e/rss-reader.spec.ts에서 두 번째 test.skip() 제거
- 테스트 실행 및 통과 확인
```

**완료 조건**:
- [ ] 유효한 HTTPS URL 입력 시 "구독이 추가되었습니다" 메시지 표시
- [ ] 두 번째 E2E 테스트 통과
- [ ] 기존 첫 번째 테스트도 여전히 통과

**예상 시간**: 1시간

---

### 2. 에러 처리 완성 (Phase 2)

**목표**: 나머지 URL 검증 E2E 테스트들 통과

**순서대로 활성화할 테스트들**:
1. "유효하지 않은 URL 입력 시 에러 메시지" 
2. "HTTP URL 입력 시 에러 메시지"
3. "빈 URL 입력 시 에러 메시지"

**구체적 작업**:
```typescript
// rssValidator.ts의 각 검증 로직 활용
- isValidUrl() - 일반적인 URL 형식 검증
- HTTPS 체크 로직
- 빈 값 체크 로직

// 각 에러 케이스별 메시지 정의
- "유효하지 않은 URL 형식입니다"
- "HTTPS URL만 허용됩니다" 
- "URL을 입력해주세요"
```

**예상 시간**: 2시간

---

### 3. Mock RSS 파서 구현 (Phase 3)

**목표**: "RSS 피드 추가 후 기사 목록 표시" E2E 테스트 통과

**구체적 작업**:
```typescript
// src/api/mockRssParser.ts 생성
export const parseMockRss = async (url: string): Promise<ParsedFeed> => {
  // 1-2초 로딩 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    title: `Feed from ${new URL(url).hostname}`,
    articles: [
      { title: "Sample Article 1", link: "...", pubDate: "..." },
      { title: "Sample Article 2", link: "...", pubDate: "..." }
    ]
  }
}

// App.tsx에서 RSS 파싱 호출
- URL 저장 후 Mock 파서 호출
- ArticleList 컴포넌트에 결과 전달
- data-testid="article-list", "article-item" 추가
```

**예상 시간**: 2-3시간

---

### 4. 로딩 상태 구현 (Phase 4)

**목표**: "로딩 상태가 적절히 표시되어야 함" E2E 테스트 통과

**구체적 작업**:
```typescript
// 로딩 상태 관리
const [isLoading, setIsLoading] = useState(false)

// 로딩 UI
{isLoading && <div>로딩 중...</div>}

// RssUrlForm props에 isLoading 전달
<RssUrlForm onSubmit={handleSubmit} isLoading={isLoading} />
```

**예상 시간**: 1시간

---

## 📋 중장기 백로그

### 실제 RSS 파싱 (향후)
- Netlify Functions로 RSS 파서 구현
- CORS 문제 해결
- 다양한 RSS/Atom 포맷 지원
- 에러 처리 및 타임아웃

### 고급 기능 (향후)
- 읽음/안읽음 상태 관리
- 기사 본문 읽기
- 피드 삭제 기능
- 새로고침 및 자동 업데이트

**다음 활성화 예정**:
1. ✅ "RSS URL 입력 폼 표시" (완료)
2. 🔄 "유효한 RSS URL 입력 시 성공 메시지" (진행 중)
3. ⏳ "유효하지 않은 URL 에러 메시지" (대기)
4. ⏳ "HTTP URL 에러 메시지" (대기)
5. ⏳ "빈 URL 에러 메시지" (대기)
6. ⏳ "RSS 피드 추가 후 기사 목록 표시" (대기)
7. ⏳ "로딩 상태 표시" (대기)

---

**마지막 업데이트**: 2025-08-19  
**다음 세션**: URL 검증 로직 통합부터 시작