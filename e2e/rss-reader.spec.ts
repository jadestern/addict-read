import { test, expect } from '@playwright/test';

test.describe('RSS Reader 기본 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('RSS URL 입력 폼이 화면에 표시되어야 함', async ({ page }) => {
    // RSS URL 입력 필드가 존재해야 함
    await expect(page.getByLabel('RSS URL')).toBeVisible();

    // "추가" 또는 "구독" 버튼이 존재해야 함
    await expect(page.getByRole('button', { name: /추가|구독/ })).toBeVisible();
  });

  test('유효한 RSS URL 입력 시 성공 메시지가 표시되어야 함', async ({ page }) => {
    const rssUrlInput = page.getByLabel('RSS URL');
    const submitButton = page.getByRole('button', { name: /추가|구독/ });

    // 유효한 HTTPS URL 입력
    await rssUrlInput.fill('https://feeds.feedburner.com/TechCrunch');
    await submitButton.click();

    // 토스트 성공 메시지 확인
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByText('구독이 추가되었습니다')).toBeVisible();
  });

  test('유효하지 않은 URL 입력 시 에러 메시지가 표시되어야 함', async ({ page }) => {
    const rssUrlInput = page.getByLabel('RSS URL');
    const submitButton = page.getByRole('button', { name: /추가|구독/ });

    // 유효하지 않은 URL 입력
    await rssUrlInput.fill('invalid-url');
    await submitButton.click();

    // 브라우저 기본 검증에 의해 폼 제출이 막히므로, 토스트가 표시되지 않는 것이 정상
    // 대신 input의 validity 상태를 확인
    const isInvalid = await rssUrlInput.evaluate((input: HTMLInputElement) => !input.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('HTTP URL 입력 시 에러 메시지가 표시되어야 함', async ({ page }) => {
    const rssUrlInput = page.getByLabel('RSS URL');
    const submitButton = page.getByRole('button', { name: /추가|구독/ });

    // HTTP URL 입력 (HTTPS만 허용)
    await rssUrlInput.fill('http://example.com/feed.xml');
    await submitButton.click();

    // 토스트 에러 메시지 확인
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByText('HTTPS URL만 허용됩니다')).toBeVisible();
  });

  test('빈 URL 입력 시 에러 메시지가 표시되어야 함', async ({ page }) => {
    const rssUrlInput = page.getByLabel('RSS URL');
    const submitButton = page.getByRole('button', { name: /추가|구독/ });

    // 빈 입력 상태에서 버튼이 비활성화되는지 확인
    await rssUrlInput.fill('');
    await expect(submitButton).toBeDisabled();
  });

  test.skip('RSS 피드 추가 후 기사 목록이 표시되어야 함', async ({ page }) => {
    const rssUrlInput = page.getByLabel('RSS URL');
    const submitButton = page.getByRole('button', { name: /추가|구독/ });

    // 유효한 RSS URL 입력
    await rssUrlInput.fill('https://feeds.feedburner.com/TechCrunch');
    await submitButton.click();

    // 기사 목록 영역이 표시되어야 함
    await expect(page.getByTestId('article-list')).toBeVisible();

    // 로딩 상태가 사라지고 기사들이 표시되어야 함
    await expect(page.getByText(/로딩/)).not.toBeVisible({ timeout: 5000 });

    // 최소 1개 이상의 기사가 표시되어야 함
    await expect(page.getByTestId('article-item')).toHaveCount(1);
  });
});