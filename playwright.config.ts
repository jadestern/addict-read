import { defineConfig, devices } from "@playwright/test";
import isCI from "is-ci";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: isCI,
	/* Retry on CI only */
	retries: isCI ? 1 : 0, // 빠른 실패를 위해 retry 줄임
	/* Opt out of parallel tests on CI. */
	workers: isCI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",

	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "http://localhost:8889/",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
		permissions: ["clipboard-read", "clipboard-write"],
		
		/* Set default timeout to 5 seconds */
		actionTimeout: 5000,
		navigationTimeout: 5000,
	},

	/* Set global test timeout to 15 seconds */
	timeout: 15000,
	expect: {
		timeout: 5000, // expect assertions timeout
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: [
		{
			command: "netlify dev --port 8889",
			url: "http://localhost:8889/",
			reuseExistingServer: !isCI,
			timeout: 60 * 1000, // 1분 타임아웃으로 단축
		},
	],
});
