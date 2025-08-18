# 다음 작업 테스크

## ✅ 완료된 작업
- RSS URL 검증 로직 구현 (TDD 방식, 10개 테스트 통과)
- UI 컴포넌트 기본 구조 (`RssUrlForm`, `ArticleList`, `ErrorMessage`)
- Vitest 테스트 환경 설정 완료

## 🚀 다음 우선순위 작업

### 1. RSS Reader 메인 UI 통합 ⭐️ **[다음 시작점]**
**목표**: 기존 컴포넌트들을 App.tsx에 통합하여 작동하는 RSS 리더 만들기

**구현 내용**:
- App.tsx에서 기존 Jazz 데모 UI 대신 RSS Reader UI 사용
- `RssUrlForm` + `ArticleList` + `ErrorMessage` 연결
- 로컬 상태로 RSS 데이터 관리 (`useState`)
- RSS URL 검증 로직 적용

**완료 조건**:
- [ ] App.tsx에 RSS Reader UI 통합
- [ ] URL 입력 → 검증 → 결과 표시 플로우 작동
- [ ] 에러 상태 및 로딩 상태 처리
- [ ] 기본 스타일링 적용

---

### 2. RSS 파싱 API 구현 (Mock 데이터)
**목표**: 실제 RSS 파싱 전에 Mock 데이터로 UI 테스트

**구현 내용**:
- `src/api/mockRssParser.ts` - Mock RSS 데이터 반환
- 일반적인 RSS 피드 형태의 샘플 데이터
- 로딩 시뮬레이션 (1-2초 delay)

**완료 조건**:
- [ ] Mock API 함수 구현
- [ ] UI에서 Mock 데이터 표시 확인
- [ ] 로딩 상태 테스트

---

### 3. E2E 테스트 작성
**목표**: Playwright로 전체 플로우 테스트

**구현 내용**:
- RSS URL 입력 및 검증 테스트
- Mock 데이터 표시 테스트
- 에러 처리 테스트

**완료 조건**:
- [ ] E2E 테스트 3-5개 작성
- [ ] 모든 테스트 통과

---

### 4. 실제 RSS 파싱 API (Netlify Functions)
**목표**: 진짜 RSS 피드 파싱 기능

**구현 내용**:
- `netlify/functions/parse-rss.ts`
- RSS/Atom 포맷 지원
- CORS 처리
- 에러 핸들링

---

## 🔄 이후 작업 (추후)
- 다중 피드 관리 (localStorage)
- 읽음/안읽음 상태 관리  
- Jazz 동기화 및 로그인 연결
- 기사 본문 읽기 기능

---

## 🛠 개발 명령어
```bash
bun run dev          # 개발 서버
bun test:run         # 유닛 테스트
bun test:e2e         # E2E 테스트
bun run build        # 빌드
```

## 📝 참고사항
- **현재 상태**: 로컬 우선, 로그인 없이 개발
- **테스트 환경**: Vitest + Playwright 설정 완료
- **스타일링**: TailwindCSS 사용
- **타입 정의**: `src/schema.ts`에 정의됨