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

This is a Jazz React starter application demonstrating local-first collaborative data structures with Passkey authentication. Jazz is a TypeScript framework for building apps with seamless sync, real-time collaboration, and offline-first capabilities.

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

## TDD 개발 방법론

이 프로젝트는 Test-Driven Development (TDD) 방식으로 개발합니다.

### 개발 접근법

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
- 7개 시나리오 모두 작성됨
- 단계별로 `test.skip()` 제거하며 구현
- 각 단계에서 완전 작동 상태 유지
