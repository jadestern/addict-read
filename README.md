# Feedic - RSS Reader

Feedic은 **[Jazz](https://jazz.tools)**를 기반으로 한 현대적인 RSS 리더입니다. React, TailwindCSS, Passkey Auth를 사용하여 구축되었습니다.

## 기능

- 🔐 **Passkey 인증** - 비밀번호 없는 안전한 로그인
- 📡 **실시간 동기화** - Jazz를 통한 기기 간 실시간 데이터 동기화
- 🎨 **모던 UI** - TailwindCSS와 토스트 알림 시스템
- ✅ **URL 검증** - HTTPS 전용 RSS URL 검증
- 📱 **반응형 디자인** - 모든 기기에서 완벽한 사용 경험

## 로컬 실행

의존성 설치:

```bash
bun install
```

개발 서버 실행:

```bash
bun run dev
```

[http://localhost:5173](http://localhost:5173)에서 확인할 수 있습니다.

## 개발 명령어

```bash
# 개발 서버
bun run dev

# 프로덕션 빌드
bun run build

# 테스트
bun run test:run          # 유닛 테스트
bun run test:e2e          # E2E 테스트

# 코드 품질
bun run format-and-lint:fix
```

## Questions / problems / feedback

If you have feedback, let us know on [Discord](https://discord.gg/utDMjHYg42) or open an issue or PR to fix something that seems wrong.


## Configuration: sync server

By default, the React starter app uses [Jazz Cloud](https://jazz.tools/cloud) (`wss://cloud.jazz.tools`) - so cross-device use, invites and collaboration should just work.

You can also run a local sync server by running `npx jazz-run sync`, and setting the `sync` parameter of `JazzReactProvider` in [./src/app.tsx](./src/app.tsx) to `{ peer: "ws://localhost:4200" }`.
