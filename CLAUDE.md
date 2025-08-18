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
- 개발 가이드, 로드맵, 명세서 등은 `docs/` 디렉토리 내에 위치
- 문서 파일명은 한글로 작성 (예: `개발-로드맵.md`, `API-명세서.md`)
- README.md와 CLAUDE.md는 루트 디렉토리에 유지

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