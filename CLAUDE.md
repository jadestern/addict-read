# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language and Communication

**IMPORTANT**: All communication and documentation in this repository should be in Korean (한글). When working with this codebase:
- Provide all responses and explanations in Korean
- Create documentation files in Korean
- Use Korean for commit messages, comments, and code documentation
- Maintain Korean language consistency throughout all interactions

## 문서 관리

**문서 위치**: 모든 프로젝트 문서는 `docs/` 폴더에 생성하고 관리합니다.
- README.md와 CLAUDE.md는 루트 디렉토리에 유지
- 문서 파일명은 영어로 작성, 내용은 한글 사용

**핵심 문서 구조**:
- `docs/tasks.md` - 현재 해야 할 작업 및 백로그 관리
- `docs/changelog.md` - 완료된 작업 및 변경 사항 기록
- `docs/1.PRD.md` - 제품 요구사항 명세
- `docs/2.user-story.md` - 사용자 스토리
- `docs/3.development-roadmap.md` - 개발 로드맵

## Project Overview

Feedic은 Jazz 프레임워크를 기반으로 한 현대적인 RSS 리더 앱입니다. Passkey 인증과 실시간 동기화를 지원하며, 로컬 우선(local-first) 협업 데이터 구조를 활용합니다. Jazz는 끊김없는 동기화, 실시간 협업, 오프라인 우선 기능을 제공하는 TypeScript 프레임워크입니다.

## Development Commands

**이 프로젝트는 Bun을 기본 패키지 매니저로 사용합니다.**

### Core Development
- `bun run dev` - Start Vite development server (http://localhost:5173)
- `bun run build` - Build production version with TypeScript compilation
- `bun run preview` - Preview production build locally

### Code Quality
- `bun run format-and-lint` - Check code formatting and linting with Biome
- `bun run format-and-lint:fix` - Auto-fix formatting and linting issues

### Testing
- `bun run test:e2e` - Run Playwright end-to-end tests
- `bun run test:e2e:ui` - Run Playwright tests with UI mode

### Package Management
- `bun install` - Install dependencies
- `bun add <package>` - Add new dependency
- `bun remove <package>` - Remove dependency

## Architecture

### Jazz Framework Integration
- **Main Provider**: `JazzReactProvider` in `src/Main.tsx` configures sync with Jazz Cloud (`wss://cloud.jazz.tools`)
- **Account System**: Uses passkey authentication with `JazzAccount` schema
- **Real-time Sync**: All data changes automatically sync across devices and users

### Schema Structure (`src/schema.ts`)
- **JazzProfile**: Public user profile data (firstName, etc.)
- **AccountRoot**: Private user data (dateOfBirth, etc.)
- **JazzAccount**: Main account type with profile and root, includes migration logic
- **Helper Functions**: `getUserAge()` for calculated values

### Component Architecture
- **App.tsx**: Main app component with authentication state and user data
- **Form.tsx**: Data binding example showing direct mutation of Jazz CoValues
- **AuthButton.tsx**: Passkey authentication UI
- **Main.tsx**: Root component with Jazz provider setup

### Key Jazz Patterns
- Direct data binding: `me.profile.firstName = e.target.value`
- Reactive data: Components automatically re-render when Jazz data changes
- Schema migrations: Account setup logic runs on creation and login
- Group permissions: Profile data is public (everyone: reader), root data is private

## Local Development

The app uses Jazz Cloud by default. To use a local sync server:
1. Run `npx jazz-run sync` to start local Jazz sync server
2. Update sync config in `src/Main.tsx` to `{ peer: "ws://localhost:4200" }`

## Schema Development

When modifying schemas in `src/schema.ts`:
- Follow Jazz CoValue patterns (co.map, co.list, etc.)
- Update migration logic for new fields
- Consider data privacy (profile vs root placement)
- Test data persistence across page refreshes

## Testing Strategy

E2E tests use Playwright with:
- Auto-start dev server on port 5173
- Clipboard permissions for copy/paste functionality
- CI-optimized retry and parallel execution settings

## Key Dependencies

- **jazz-tools**: Core Jazz framework with React hooks and CoValue types
- **React 19**: Latest React with concurrent features
- **Vite**: Build tool and dev server
- **TailwindCSS 4**: Utility-first CSS framework
- **Biome**: Fast formatter and linter
- **Playwright**: End-to-end testing framework

## 배포 및 인프라

### Netlify 배포
이 프로젝트는 Netlify를 사용하여 배포됩니다:

**배포 설정**:
- **빌드 명령어**: `bun run build`
- **배포 디렉토리**: `dist`
- **Node.js 버전**: 최신 LTS 버전 사용 (Bun 호환)
- **도메인**: Netlify 기본 도메인 사용 (`.netlify.app`)

**자동 배포**:
- GitHub 저장소와 연결하여 `main` 브랜치 푸시 시 자동 배포
- PR 생성 시 미리보기 배포 자동 생성

### Netlify Functions (백엔드)
추가적인 서버 로직이 필요한 경우 Netlify Functions 사용:

**Functions 디렉토리**: `netlify/functions/`
**사용 사례**:
- 외부 API 연동
- 서버사이드 데이터 처리
- 인증 로직 (Jazz 외 추가 인증이 필요한 경우)

**개발 환경에서 Functions 테스트**:
```bash
bun add -g netlify-cli
netlify dev
```

### 환경 변수
Netlify 대시보드에서 설정 필요한 환경 변수들:
- `VITE_JAZZ_API_KEY`: Jazz Cloud API 키 (현재 `src/apiKey.ts`에 하드코딩됨)
- 추가 써드파티 서비스 키들 (필요시)

### 배포 최적화
- Vite 빌드 최적화로 빠른 로딩
- Jazz의 로컬 퍼스트 특성으로 서버 의존성 최소화
- 정적 파일 CDN 자동 배포

## 🚨 TDD 개발 방법론 (필수 준수)

이 프로젝트는 **엄격한 Test-Driven Development (TDD) 방식**으로 개발합니다.

### ⚠️ 절대 원칙: 테스트 우선 (Test-First)

**🔴 RED → 🟢 GREEN → ⚪ REFACTOR 순서 필수**

```
❌ 절대 금지: 구현 → 테스트 작성
✅ 필수 순서: 테스트 작성 → 구현 → 리팩터링
```

### 🔥 강제 TDD 워크플로우

**1. 🔴 RED**: 실패하는 테스트 먼저 작성
```typescript
// ❌ 이렇게 하지 마세요
function deleteFunction() { /* 구현 먼저 */ }
test('should delete', () => { /* 나중에 테스트 */ });

// ✅ 이렇게 하세요 
test.skip('구독된 피드 삭제 기능이 작동해야 함', async ({ page }) => {
  // 테스트 시나리오 먼저 작성
  await page.getByTestId('delete-feed-0').click();
  await expect(page.getByText('피드가 삭제되었습니다')).toBeVisible();
});
```

**2. 🟢 GREEN**: 테스트를 통과시키는 최소 구현
```typescript
// test.skip() 제거 후 실패 확인
// 최소한의 구현으로 테스트 통과시키기
const handleDeleteFeed = () => {
  showToast('피드가 삭제되었습니다', 'success');
};
```

**3. ⚪ REFACTOR**: 코드 품질 개선
```typescript
// 테스트 통과 후 실제 기능 구현 및 최적화
const handleDeleteFeed = async (feedId: string, feedUrl: string) => {
  // 완전한 구현
};
```

### 🎯 TDD 체크리스트 (매번 확인)

**새 기능 개발 시 필수 순서**:
1. [ ] **테스트 시나리오 작성** (`test.skip()` 사용)
2. [ ] **테스트 활성화** (`test.skip()` 제거)
3. [ ] **실패 확인** (Red 상태)
4. [ ] **최소 구현** (Green 상태)
5. [ ] **리팩터링** (품질 개선)
6. [ ] **모든 테스트 통과** 확인

### 🚫 TDD 위반 시 즉시 중단

다음 상황 발견 시 **즉시 작업 중단**하고 TDD로 다시 시작:
- 테스트 없이 구현된 코드
- 기능 구현 후 작성된 테스트
- `test.skip()` 패턴 무시

### 📋 개발 접근법

**1. 유틸리티 함수 → 유닛 테스트 (Vitest)**
- URL 검증, 데이터 변환, 계산 로직 등
- `src/utils/` 디렉토리의 함수들
- 테스트 파일: `*.test.ts`

**예시**: `src/utils/rssValidator.test.ts`
```typescript
describe('RSS URL 검증', () => {
  it('유효한 HTTPS URL을 허용해야 함', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })
})
```

**2. 기능 구현 → 인수 테스트 (Playwright E2E)**
- 사용자 스토리 기반 기능
- 실제 사용자 플로우 테스트
- 테스트 파일: `tests/*.spec.ts`

### 인수 기준 기반 개발

**1단계: 인수 기준 정의**
- PRD의 사용자 스토리에서 인수 기준 추출
- 구체적이고 테스트 가능한 조건으로 작성

**2단계: 인수 테스트 작성**
- 인수 기준을 Playwright 테스트로 변환
- 테스트는 실패해야 함 (Red)

**3단계: 최소 구현**
- 테스트를 통과시키는 최소한의 코드 작성 (Green)

**4단계: 리팩터링**
- 코드 품질 향상 (Refactor)

### 인수 기준 템플릿

```markdown
**기능**: RSS 피드 추가
**시나리오**: 유효한 RSS URL 입력
- **조건**: 메인 페이지에서
- **행동**: 유효한 RSS URL을 입력하고 "추가" 버튼 클릭
- **결과**: 
  - 피드가 구독 목록에 나타남
  - "구독이 추가되었습니다" 확인 메시지 표시
  - 해당 피드의 기사들이 목록에 표시됨
```

### E2E 테스트 Skip 전략

**점진적 기능 개발을 위한 테스트 Skip 패턴**:

E2E 테스트에서 여러 시나리오를 작성한 후, `test.skip()`을 사용하여 단계별로 개발:

```typescript
// 첫 번째 테스트만 활성화, 나머지는 skip
test('기본 UI 존재 확인', async ({ page }) => {
  // 현재 개발 중인 테스트
});

test.skip('유효한 입력 처리', async ({ page }) => {
  // 다음 단계에서 활성화할 테스트
});

test.skip('에러 처리', async ({ page }) => {
  // 이후 단계에서 활성화할 테스트
});
```

**Skip 전략의 장점**:
- 전체 기능 요구사항을 미리 정의
- 단계별 구현으로 복잡도 관리
- 각 단계별 명확한 성공/실패 기준
- 점진적 리팩터링 가능

**개발 흐름**:
1. 모든 E2E 테스트 시나리오 작성
2. 첫 번째 테스트만 활성화 (나머지 skip)
3. 첫 번째 테스트 통과시키는 최소 구현
4. 다음 테스트 활성화 후 반복

### 테스트 명령어

```bash
# 유닛 테스트 (TDD 개발 중)
bun test:run src/utils/filename.test.ts

# 전체 유닛 테스트
bun test:run

# E2E 테스트 (기능 완성 후)
bun test:e2e

# 테스트 감시 모드 (개발 중)
bun test

# 🚨 커밋 전 필수 체크 (Oxlint + Prettier 기반)
bun run check              # 전체 체크 (포매팅 + 린트 + 타입)
# 또는 개별 실행:
bun run format:fix         # Prettier 포매팅 수정
bun run lint               # Oxlint로 빠른 린트 체크
bunx tsc --noEmit         # TypeScript 타입 체크
bun test:e2e               # E2E 테스트 실행
```

### TDD 체크리스트

**유틸리티 함수 개발 시**:
- [ ] 실패하는 유닛 테스트 작성
- [ ] 최소 구현으로 테스트 통과
- [ ] 리팩터링 및 엣지 케이스 추가

**기능 개발 시**:
- [ ] 인수 기준 문서화
- [ ] 실패하는 E2E 테스트 작성  
- [ ] 기능 구현
- [ ] 모든 테스트 통과 확인

### 🚨 Git 커밋 전 필수 체크리스트

**매번 커밋하기 전에 반드시 실행:**

```bash
# 1. 타입 체크
bunx tsc --noEmit

# 2. 코드 품질 체크 및 수정
bun run format-and-lint:fix

# 3. E2E 테스트 통과 확인
bun test:e2e
```

**체크리스트:**
- [ ] TypeScript 타입 오류 없음
- [ ] Prettier 포매팅 통과
- [ ] Oxlint 경고 최소화 (중대한 오류 없음)
- [ ] 모든 E2E 테스트 통과
- [ ] 변경사항이 기존 기능을 손상시키지 않음
- [ ] 커밋 메시지가 명확하고 구체적임

**Oxlint vs Biome 장점:**
- ⚡ **10배 빠른 속도**: Oxlint는 Rust 기반으로 매우 빠름
- 🎯 **필수 오류 집중**: 중요한 오류만 잡아냄 (경고는 허용 가능)
- 🔧 **Prettier 분리**: 포매팅은 Prettier, 린팅은 Oxlint 역할 분담

## Git 및 GitHub 워크플로우

이 프로젝트는 **GitHub CLI (`gh`)를 적극적으로 활용**하여 효율적인 개발 워크플로우를 구축합니다.

### GitHub CLI 필수 명령어

**저장소 관리**:
```bash
gh repo view                    # 저장소 정보 확인
gh repo clone owner/repo        # 저장소 클론
gh browse                       # 브라우저에서 저장소 열기
```

**이슈 관리**:
```bash
gh issue list                   # 이슈 목록 확인
gh issue create --title "제목" --body "내용"  # 새 이슈 생성
gh issue view 123               # 특정 이슈 확인
gh issue close 123              # 이슈 닫기
```

**Pull Request 워크플로우**:
```bash
# PR 생성 (현재 브랜치에서)
gh pr create --title "PR 제목" --body "설명"

# PR 목록 및 상태 확인
gh pr list
gh pr status

# PR 세부사항 확인
gh pr view 123
gh pr diff 123

# PR 병합
gh pr merge 123 --squash --delete-branch

# PR 체크아웃 (리뷰용)
gh pr checkout 123
```

**릴리즈 관리**:
```bash
gh release list                 # 릴리즈 목록
gh release create v1.0.0 --title "Release v1.0.0" --notes "릴리즈 노트"
gh release view v1.0.0          # 특정 릴리즈 확인
```

### 권장 Git + GitHub CLI 워크플로우

**1. 기능 개발 시작**:
```bash
git checkout -b feature/rss-parser
# 개발 작업...
git add .
git commit -m "RSS 파서 구현"
git push -u origin feature/rss-parser
```

**2. PR 생성 및 리뷰**:
```bash
gh pr create --title "RSS 파서 구현" --body "$(cat <<'EOF'
## 변경사항
- RSS URL 파싱 기능 추가
- 에러 처리 로직 구현

## 테스트
- [ ] 유닛 테스트 통과
- [ ] E2E 테스트 통과

## 체크리스트
- [ ] 코드 리뷰 완료
- [ ] 테스트 커버리지 확인
EOF
)"
```

**3. 이슈 연결**:
```bash
# PR에 이슈 연결
gh pr edit 123 --body "Closes #456\n\n기존 내용..."
```

**4. 머지 및 정리**:
```bash
gh pr merge --squash --delete-branch
git checkout main
git pull
```

### 자동화된 커밋 및 푸시

**일반 개발 커밋**:
```bash
# 변경사항 확인
git status
git diff

# 커밋 및 푸시
git add .
git commit -m "$(cat <<'EOF'
기능 요약

- 구체적인 변경사항 1
- 구체적인 변경사항 2
- 테스트 결과 요약
EOF
)"
git push
```

**PR 준비된 기능 푸시**:
```bash
# 기능 완성 후
git push
gh pr create --title "기능명" --body "상세 설명"
```

### GitHub CLI 설정

프로젝트 시작 시 GitHub CLI 인증 확인:
```bash
gh auth status
gh auth login  # 필요시
```

### 협업 시 권장사항

- **이슈 우선 생성**: 작업 전 관련 이슈 생성
- **브랜치 네이밍**: `feature/기능명`, `fix/버그명`, `docs/문서명`
- **PR 템플릿 활용**: 일관된 PR 설명 작성
- **자동 링크**: PR과 이슈 자동 연결 (`Closes #123`)
- **스쿼시 머지**: 깔끔한 히스토리 유지

---
## 🛠 개발 명령어

```bash
# 개발
bun run dev          # 개발 서버 (http://localhost:5173)
bun run build        # 프로덕션 빌드

# 테스트
bun test:run         # 유닛 테스트 (10개 RSS 검증)
bun test:e2e         # E2E 테스트 (현재 1/7 활성화)
bun test             # 유닛 테스트 감시 모드

# 코드 품질
bun run format-and-lint:fix
```

---

## 📝 기술 스택 현황

- **프레임워크**: React 19 + Vite
- **데이터**: Jazz CoValue (실시간 동기화)
- **스타일링**: TailwindCSS 4
- **테스트**: Vitest (유닛) + Playwright (E2E)
- **패키지 매니저**: Bun
- **배포**: Netlify

---

## 🎯 TDD 전략

**현재 방식**: E2E 테스트 Skip 패턴
- 단계별로 `test.skip()` 제거하며 구현
- 각 단계에서 완전 작동 상태 유지

---

## 🔧 Jazz Framework 핵심 학습 사항

### Jazz 데이터 영속성 + 반응성 패턴

**핵심 원칙**: Jazz CoValue는 자체적으로 React 반응성을 제공하므로 useState 불필요

```typescript
// ❌ 불필요한 중복 - Jazz 데이터를 useState로 복사
const [articles, setArticles] = useState<Article[]>([]);

useEffect(() => {
  if (me?.root?.importedArticles) {
    const jazzArticles = me.root.importedArticles.map(article => ({ ... }));
    setArticles(jazzArticles); // 불필요한 복사 + 동기화 복잡성
  }
}, [me?.root?.importedArticles]);

// ✅ Jazz 직접 사용 - 자동 영속성 + 반응성
const articles = useMemo(() => {
  if (!me?.root?.importedArticles) return [];
  return me.root.importedArticles
    .filter(article => article !== null)
    .map(article => ({
      title: article.title,
      link: article.url,
      pubDate: article.pubDate,
    }));
}, [me?.root?.importedArticles]);
```

**Jazz 반응성 메커니즘**:
- `me?.root?.importedArticles` 변경 시 자동 리렌더링
- 데이터가 Jazz에 저장되면 즉시 UI 업데이트
- 새로고침 시에도 Jazz 데이터가 자동 복원되어 UI 표시

### Jazz Schema Import 주의사항

```typescript
// ❌ 타입 충돌 위험
import { Article } from "./schema.ts";
import { Article } from "./types/rss.ts";

// ✅ alias 사용으로 충돌 방지
import { Article as JazzArticle } from "./schema.ts";
import { Article } from "./types/rss.ts";
```

### Jazz 데이터 초기화 패턴

```typescript
// Jazz 데이터 컬렉션 초기화 시 체크 필수
if (!me.root.importedArticles) {
  const privateGroup = Group.create();
  privateGroup.addMember(me, "writer");
  me.root.importedArticles = co.list(JazzArticle).create([], privateGroup);
}
```

### 함수 분리 및 에러 처리 전략

**문제**: 하나의 긴 함수에서 구독 추가와 RSS 파싱이 혼재
**해결**: 기능별 함수 분리 + 개별 에러 처리

```typescript
// ✅ 구독 추가와 파싱을 분리하여 독립적 에러 처리
const handleRssSubmit = async (url: string) => {
  const subscriptionAdded = await addSubscription(url);  // 구독 처리
  if (subscriptionAdded) {
    await parseAndSaveArticles(url);  // 파싱 처리 (별도 try/catch)
  }
};
```

### Toast 시스템 설계 원칙

1. **중복 방지**: 하나의 이벤트에 대해 하나의 토스트만
2. **단계별 피드백**: 구독 추가 → 성공 토스트 → 파싱 시작 → 완료/에러
3. **명확한 메시지**: 구체적인 상황 설명

### E2E 테스트 작성 핵심

```typescript
// ✅ 에러 시나리오 테스트
test('RSS 파싱 실패 시 에러 메시지가 표시되어야 함', async ({ page }) => {
  // Mock API에서 특정 URL로 에러 발생시키기
  const errorUrl = 'https://invalid-rss-feed.com/error';
  
  // 구독 성공 → 파싱 실패 순서로 테스트
  await expect(page.getByTestId('success-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 3000 });
});
```

### 개발 중 디버깅 전략

1. **콘솔 로그 활용**: 개발 중에는 적극 활용, 완성 후 제거
2. **Jazz 데이터 상태 확인**: `me?.root?.importedFeeds` falsy 체크 필수
3. **React DevTools**: Jazz 데이터 변화 실시간 모니터링

### 리팩터링 체크리스트

- [ ] 함수 단일 책임 원칙 준수
- [ ] 에러 처리 분리 (구독 vs 파싱)
- [ ] Jazz 데이터 초기화 체크
- [ ] 콘솔 로그 제거
- [ ] 모든 E2E 테스트 통과

---

## 🎯 Mock → 실제 구현 전환 방법론

### 핵심 전략: 단계별 격리 디버깅

**Phase 5 실제 RSS 파싱 구현에서 학습한 검증된 방법론**

#### 1. **TDD Skip 전략으로 문제 격리**

```typescript
// ❌ 모든 테스트를 한번에 실행 → 여러 에러 동시 발생
test('모든 기능이 작동해야 함', async ({ page }) => {
  // 복잡한 플로우
});

// ✅ 첫 번째 테스트만 활성화 → 단계별 검증
test('기본 UI가 표시되어야 함', async ({ page }) => {
  // 기본 기능만 테스트
});

test.skip('실제 API 호출이 작동해야 함', async ({ page }) => {
  // 다음 단계에서 활성화
});
```

#### 2. **Mock → 실제 전환 시 체크포인트**

**Step 1: 기본 UI 검증**
- ✅ 컴포넌트 렌더링
- ✅ 폼 입력/버튼 상호작용

**Step 2: Mock 데이터 플로우 검증**  
- ✅ Mock API로 전체 플로우
- ✅ 데이터 바인딩 및 상태 관리

**Step 3: 실제 구현 전환**
- ❌ 네트워크/환경 에러 발생 가능
- 🔧 환경 설정 문제 해결

**Step 4: 점진적 기능 확장**
- ✅ 단계별로 `test.skip()` 제거
- ✅ 각 단계에서 완전 작동 상태 유지

#### 3. **환경 차이 문제 해결 패턴**

**CORS + Netlify Functions 통합**:
```typescript
// 환경별 API 엔드포인트 분리
const baseUrl = import.meta.env.DEV 
  ? "http://localhost:8889" // Netlify Dev 서버
  : ""; // 프로덕션

// netlify.toml 필수 설정
[dev]
  command = "bun run dev"
  targetPort = 5173  # Vite 개발 서버
  port = 8889        # Netlify Dev 서버
```

#### 4. **실제 데이터 테스트의 중요성**

```typescript
// ❌ 테스트용 가짜 URL
await rssUrlInput.fill("https://fake-test-url.com");

// ✅ 실제 동작하는 RSS URL 사용
await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
```

**실제 RSS URL 사용 시 장점**:
- 실제 네트워크 환경 테스트
- RSS 파서 라이브러리 검증  
- CORS 설정 완전 검증

#### 5. **디버깅 우선순위**

1. **UI 계층**: 컴포넌트 렌더링 문제
2. **로직 계층**: 데이터 플로우 및 상태 관리  
3. **네트워크 계층**: API 호출 및 CORS
4. **환경 계층**: 개발/프로덕션 설정 차이

#### 6. **성공 지표**

- ✅ **4/4 E2E 테스트 연속 통과**
- ✅ **실제 RSS 데이터로 완전한 플로우**  
- ✅ **네트워크 에러 없는 안정적 동작**
- ✅ **개발/프로덕션 환경 모두 지원**

### 다음 프로젝트 적용 가이드

1. **복잡한 기능일수록 Skip 전략 필수**
2. **Mock → 실제 전환은 별도 단계로 분리** 
3. **환경 차이를 고려한 설정 사전 준비**
4. **실제 데이터로 테스트하여 완전성 검증**
