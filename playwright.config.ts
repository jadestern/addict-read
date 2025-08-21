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
	retries: isCI ? 2 : 0,
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
		
		/* Set default timeout to 10 seconds */
		actionTimeout: 10000,
		navigationTimeout: 10000,
	},

	/* Set global test timeout to 30 seconds */
	timeout: 30000,
	expect: {
		timeout: 10000, // expect assertions timeout
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
			timeout: 120 * 1000, // 2분 타임아웃 (netlify dev 시작 시간 고려)
		},
	],
});
