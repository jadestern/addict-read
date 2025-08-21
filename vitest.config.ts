import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // E2E 테스트 파일 제외 (Playwright 전용)
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/tests/**", // Playwright E2E 테스트 폴더 제외
      "**/*.spec.ts", // .spec.ts 파일은 E2E 테스트용
    ],
    // 유닛 테스트만 포함
    include: ["**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
  },
});
