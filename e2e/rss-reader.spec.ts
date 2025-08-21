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

  test("유효하지 않은 URL 입력 시 에러 메시지가 표시되어야 함", async ({
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
      (input: HTMLInputElement) => !input.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  test("HTTP URL 입력 시 에러 메시지가 표시되어야 함", async ({ page }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // HTTP URL 입력 (HTTPS만 허용)
    await rssUrlInput.fill("http://example.com/feed.xml");
    await submitButton.click();

    // 토스트 에러 메시지 확인
    await expect(page.getByTestId("error-message")).toBeVisible();
    await expect(page.getByText("HTTPS URL만 허용됩니다")).toBeVisible();
  });

  test("빈 URL 입력 시 에러 메시지가 표시되어야 함", async ({ page }) => {
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

  test("RSS 파싱 실패 시 에러 메시지가 표시되어야 함", async ({ page }) => {
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
      page.getByText("기사를 불러오는데 실패했습니다")
    ).toBeVisible();
  });

  test("구독된 피드 삭제 기능이 작동해야 함", async ({ page }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 구독 목록에 피드가 표시되는지 확인
    await expect(page.getByText("구독 중인 피드:")).toBeVisible();
    await expect(
      page.getByText("Feed from feeds.feedburner.com")
    ).toBeVisible();

    // 삭제 버튼 클릭
    await page.getByTestId("delete-feed-0").click();

    // 삭제 성공 토스트 확인
    await expect(page.getByText("피드가 삭제되었습니다")).toBeVisible();

    // 피드가 목록에서 사라졌는지 확인
    await expect(
      page.getByText("Feed from feeds.feedburner.com")
    ).not.toBeVisible();

    // 관련 기사들도 사라졌는지 확인
    await expect(page.getByTestId("article-item")).toHaveCount(0);
  });

  test("최신 기사가 먼저 표시되어야 함", async ({ page }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록이 로딩된 후 확인
    await expect(page.getByText(/로딩/)).not.toBeVisible();

    // 기사들이 표시되는지 확인 (실제 RSS에서는 개수가 다를 수 있음)
    const articles = page.getByTestId("article-item");
    await expect(articles.first()).toBeVisible();

    // 기사가 최소 1개 이상 있는지 확인
    const articleCount = await articles.count();
    expect(articleCount).toBeGreaterThan(0);

    // 기사들이 시간순으로 정렬되어 있는지 확인 (날짜 추출해서 비교)
    if (articleCount > 1) {
      const firstTime = await articles
        .first()
        .locator("time")
        .getAttribute("datetime");
      const secondTime = await articles
        .nth(1)
        .locator("time")
        .getAttribute("datetime");

      if (firstTime && secondTime) {
        expect(new Date(firstTime).getTime()).toBeGreaterThanOrEqual(
          new Date(secondTime).getTime()
        );
      }
    }
  });

  // 🆕 기사 카드 클릭 시 상세 페이지로 이동 + 읽음 상태 변경 테스트
  test("기사 카드 클릭 시 상세 페이지로 이동하고 읽음 상태가 변경되어야 함", async ({
    page,
  }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 첫 번째 기사가 안읽음 상태인지 확인
    const firstArticle = page.getByTestId("article-item").first();
    await expect(firstArticle).toHaveClass(/unread/); // 안읽음 스타일

    // 기사 카드 전체 클릭하여 상세 페이지로 이동
    await firstArticle.click();

    // 상세 페이지로 이동했는지 확인
    await expect(page.getByTestId("article-detail")).toBeVisible();
    await expect(page.getByTestId("back-button")).toBeVisible();

    // 뒤로가기 버튼 클릭하여 목록으로 돌아가기
    await page.getByTestId("back-button").click();

    // 메인 페이지로 돌아왔는지 확인
    await expect(page.getByTestId("article-list")).toBeVisible();

    // 클릭한 기사가 읽음 상태로 변경되었는지 확인
    await expect(firstArticle).toHaveClass(/read/); // 읽음 스타일
    await expect(firstArticle).not.toHaveClass(/unread/);
  });

  test("전체 읽음 버튼이 작동해야 함", async ({ page }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 모든 기사가 안읽음 상태인지 확인
    const articles = page.getByTestId("article-item");
    const articleCount = await articles.count();
    for (let i = 0; i < articleCount; i++) {
      await expect(articles.nth(i)).toHaveClass(/unread/);
    }

    // 전체 읽음 버튼 클릭
    await page.getByTestId("mark-all-read-button").click();

    // 모든 기사가 읽음 상태로 변경되었는지 확인
    for (let i = 0; i < articleCount; i++) {
      await expect(articles.nth(i)).toHaveClass(/read/);
      await expect(articles.nth(i)).not.toHaveClass(/unread/);
    }
  });

  test("읽음 상태에 따른 시각적 구분이 표시되어야 함", async ({ page }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    const firstArticle = page.getByTestId("article-item").first();

    // 안읽음 상태일 때 스타일 확인
    await expect(firstArticle).toHaveClass(/unread/);
    // 안읽음 기사는 투명도가 낮고 제목이 굵게 표시
    await expect(firstArticle).toHaveCSS("opacity", "1");

    // 기사 카드 클릭하여 상세 페이지로 이동 후 바로 뒤로가기
    await firstArticle.click();
    await expect(page.getByTestId("article-detail")).toBeVisible();
    await page.getByTestId("back-button").click();
    await expect(page.getByTestId("article-list")).toBeVisible();

    // 읽음 상태일 때 스타일 확인
    await expect(firstArticle).toHaveClass(/read/);
    // 읽음 기사는 투명도가 높고 회색으로 표시
    await expect(firstArticle).toHaveCSS("opacity", /0\.[5-8]/); // 0.5-0.8 범위
  });

  test("기사 상세 페이지에서 브라우저 뒤로가기가 올바르게 작동해야 함", async ({
    page,
  }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 메인 페이지 URL 확인
    expect(page.url()).toMatch(/\/$|\/$/);

    // 첫 번째 기사 클릭하여 상세 페이지로 이동
    const firstArticle = page.getByTestId("article-item").first();
    await firstArticle.click();

    // 상세 페이지 URL 확인 (히스토리가 한 번만 쌓였는지)
    await expect(page.getByTestId("article-detail")).toBeVisible();
    expect(page.url()).toMatch(/\/article\//);

    // 브라우저 뒤로가기 버튼으로 목록으로 돌아가기 (한 번만!)
    await page.goBack();

    // 메인 페이지로 돌아왔는지 확인
    await expect(page.getByTestId("article-list")).toBeVisible();
    expect(page.url()).toMatch(/\/$|\/$/);
  });

  test("상세 페이지에서 페이지 제목이 기사 제목으로 변경되어야 함", async ({
    page,
  }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 메인 페이지에서 기본 제목 확인
    await expect(page).toHaveTitle("Feedic");

    // 첫 번째 기사의 제목 가져오기
    const firstArticle = page.getByTestId("article-item").first();
    const articleTitle = await firstArticle
      .locator("h3")
      .first()
      .textContent();

    // 기사 클릭하여 상세 페이지로 이동
    await firstArticle.click();

    // 상세 페이지에서 제목이 "기사제목 - Feedic" 형태로 변경되었는지 확인
    await expect(page.getByTestId("article-detail")).toBeVisible();
    
    // 기사 상세 정보가 완전히 로드되기까지 잠시 대기
    await page.waitForTimeout(1000);
    
    if (articleTitle) {
      await expect(page).toHaveTitle(`${articleTitle} - Feedic`, { timeout: 10000 });
    }

    // 뒤로가기 후 다시 기본 제목으로 돌아오는지 확인
    await page.getByTestId("back-button").click();
    await expect(page.getByTestId("article-list")).toBeVisible();
    await expect(page).toHaveTitle("Feedic");
  });

  test("상세 페이지에서 새로고침 시 페이지가 유지되어야 함", async ({
    page,
  }) => {
    const rssUrlInput = page.getByLabel("RSS URL");
    const submitButton = page.getByRole("button", { name: /추가|구독/ });

    // 피드 추가
    await rssUrlInput.fill("https://feeds.feedburner.com/c_news");
    await submitButton.click();
    await expect(page.getByTestId("success-message")).toBeVisible();

    // 기사 목록 로딩 완료 대기
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 첫 번째 기사 클릭하여 상세 페이지로 이동
    const firstArticle = page.getByTestId("article-item").first();
    const articleTitle = await firstArticle
      .locator("h3")
      .first()
      .textContent();
    
    await firstArticle.click();
    await expect(page.getByTestId("article-detail")).toBeVisible();

    // 현재 URL 확인 (상세 페이지 URL이어야 함)
    const detailPageUrl = page.url();
    expect(detailPageUrl).toContain("/article/");

    // 페이지 제목이 기사 제목으로 변경될 때까지 대기
    if (articleTitle) {
      await expect(page).toHaveTitle(`${articleTitle} - Feedic`, { timeout: 5000 });
    }

    // 페이지 새로고침
    await page.reload({ waitUntil: 'networkidle' });

    // 새로고침 직후 잠시 대기 (Jazz 데이터 동기화)
    await page.waitForTimeout(2000);

    // 홈 페이지로 리다이렉트되었는지 확인 (현재 버그)
    const currentUrl = page.url();
    
    if (currentUrl.includes('/article/')) {
      // 상세 페이지가 유지됨 (수정된 상태)
      await expect(page.getByTestId("article-detail")).toBeVisible({ timeout: 5000 });
      if (articleTitle) {
        await expect(page).toHaveTitle(`${articleTitle} - Feedic`, { timeout: 5000 });
      }
    } else {
      // 홈으로 리다이렉트됨 (현재 버그 상태)
      await expect(page.getByTestId("article-list")).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveTitle("Feedic");
      
      // 이 경우 테스트 실패로 처리
      throw new Error(`새로고침 후 홈페이지로 리다이렉트됨. 현재 URL: ${currentUrl}, 예상 URL: ${detailPageUrl}`);
    }
  });
});
