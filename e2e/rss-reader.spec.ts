import { expect, test } from "@playwright/test";

test.describe("RSS Reader 기본 기능", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("RSS URL 입력 폼이 화면에 표시되어야 함", async ({ page }) => {
		// RSS URL 입력 필드가 존재해야 함
		await expect(page.getByLabel("RSS URL")).toBeVisible();

		// "추가" 또는 "구독" 버튼이 존재해야 함
		await expect(page.getByRole("button", { name: /추가|구독/ })).toBeVisible();
	});

	test("유효한 RSS URL 입력 시 성공 메시지가 표시되어야 함", async ({
		page,
	}) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 유효한 HTTPS URL 입력
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();

		// 토스트 성공 메시지 확인
		await expect(page.getByTestId("success-message")).toBeVisible();
		await expect(page.getByText("구독이 추가되었습니다")).toBeVisible();
	});

	test.skip("유효하지 않은 URL 입력 시 에러 메시지가 표시되어야 함", async ({
		page,
	}) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 유효하지 않은 URL 입력
		await rssUrlInput.fill("invalid-url");
		await submitButton.click();

		// 브라우저 기본 검증에 의해 폼 제출이 막히므로, 토스트가 표시되지 않는 것이 정상
		// 대신 input의 validity 상태를 확인
		const isInvalid = await rssUrlInput.evaluate(
			(input: HTMLInputElement) => !input.validity.valid,
		);
		expect(isInvalid).toBe(true);
	});

	test.skip("HTTP URL 입력 시 에러 메시지가 표시되어야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// HTTP URL 입력 (HTTPS만 허용)
		await rssUrlInput.fill("http://example.com/feed.xml");
		await submitButton.click();

		// 토스트 에러 메시지 확인
		await expect(page.getByTestId("error-message")).toBeVisible();
		await expect(page.getByText("HTTPS URL만 허용됩니다")).toBeVisible();
	});

	test.skip("빈 URL 입력 시 에러 메시지가 표시되어야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 빈 입력 상태에서 버튼이 비활성화되는지 확인
		await rssUrlInput.fill("");
		await expect(submitButton).toBeDisabled();
	});

	test("RSS 피드 추가 후 기사 목록이 표시되어야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 유효한 RSS URL 입력
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();

		// 기사 목록 영역이 표시되어야 함
		await expect(page.getByTestId("article-list")).toBeVisible();

		// 로딩 상태가 사라지고 기사들이 표시되어야 함
		await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

		// 최소 1개 이상의 기사가 표시되어야 함
		const articleCount = await page.getByTestId("article-item").count();
		expect(articleCount).toBeGreaterThan(0);
	});

	test("RSS URL 추가 후 입력 필드가 초기화되어야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 유효한 RSS URL 입력
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();

		// 성공 토스트가 표시되면 입력 필드가 비어져야 함
		await expect(page.getByTestId("success-message")).toBeVisible();
		await expect(rssUrlInput).toHaveValue("");
	});

	test("중복된 RSS URL 추가 시 에러 메시지가 표시되어야 함", async ({
		page,
	}) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 첫 번째 RSS URL 추가
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();
		await expect(page.getByTestId("success-message")).toBeVisible();

		// 같은 URL 다시 추가 시도
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();

		// 중복 에러 메시지 확인
		await expect(page.getByTestId("error-message")).toBeVisible();
		await expect(page.getByText("이미 구독 중인 피드입니다!")).toBeVisible();
	});

	test.skip("RSS 파싱 실패 시 에러 메시지가 표시되어야 함", async ({ page }) => {
		// Mock API에서 에러를 발생시키기 위해 특정 URL 사용
		const errorUrl = "https://invalid-rss-feed.com/error";

		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 에러를 발생시킬 URL 입력
		await rssUrlInput.fill(errorUrl);
		await submitButton.click();

		// 구독 추가 성공 토스트가 먼저 나타날 수 있음
		await expect(page.getByTestId("success-message")).toBeVisible();

		// 파싱 에러 토스트 확인 (약간의 지연 후)
		await expect(page.getByTestId("error-message")).toBeVisible({
			timeout: 3000,
		});
		await expect(
			page.getByText("기사를 불러오는데 실패했습니다"),
		).toBeVisible();
	});

	test.skip("구독된 피드 삭제 기능이 작동해야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 피드 추가
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();
		await expect(page.getByTestId("success-message")).toBeVisible();

		// 구독 목록에 피드가 표시되는지 확인
		await expect(page.getByText("구독 중인 피드:")).toBeVisible();
		await expect(page.getByText("feedburner.com Feed")).toBeVisible();

		// 삭제 버튼 클릭
		await page.getByTestId("delete-feed-0").click();

		// 삭제 성공 토스트 확인
		await expect(page.getByTestId("success-message")).toBeVisible();
		await expect(page.getByText("피드가 삭제되었습니다")).toBeVisible();

		// 피드가 목록에서 사라졌는지 확인
		await expect(page.getByText("feedburner.com Feed")).not.toBeVisible();

		// 관련 기사들도 사라졌는지 확인
		await expect(page.getByTestId("article-item")).toHaveCount(0);
	});

	test.skip("최신 기사가 먼저 표시되어야 함", async ({ page }) => {
		const rssUrlInput = page.getByLabel("RSS URL");
		const submitButton = page.getByRole("button", { name: /추가|구독/ });

		// 피드 추가
		await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
		await submitButton.click();
		await expect(page.getByTestId("success-message")).toBeVisible();

		// 기사 목록이 로딩된 후 확인
		await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

		// 기사들이 표시되는지 확인
		const articles = page.getByTestId("article-item");
		await expect(articles).toHaveCount(3);

		// 첫 번째 기사가 가장 최신 기사인지 확인 (Mock 데이터에서 i=0이 가장 최신)
		const firstArticle = articles.first();
		await expect(firstArticle).toContainText("샘플 기사 1");
	});
});
