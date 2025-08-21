import { describe, expect, it } from "vitest";
import { isValidUrl, validateRssUrl } from "./rssValidator";

describe("RSS URL 검증", () => {
  describe("isValidUrl", () => {
    it("유효한 HTTP URL을 허용해야 함", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("http://example.com/feed")).toBe(true);
    });

    it("유효한 HTTPS URL을 허용해야 함", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("https://example.com/feed.xml")).toBe(true);
      expect(isValidUrl("https://blog.example.com/rss")).toBe(true);
    });

    it("잘못된 URL 형식을 거부해야 함", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl(" ")).toBe(false);
    });

    it("상대 경로를 거부해야 함", () => {
      expect(isValidUrl("/feed.xml")).toBe(false);
      expect(isValidUrl("./feed.xml")).toBe(false);
      expect(isValidUrl("../feed.xml")).toBe(false);
    });
  });

  describe("validateRssUrl", () => {
    it("일반적인 RSS URL 패턴을 허용해야 함", () => {
      const result1 = validateRssUrl("https://example.com/feed.xml");
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeNull();

      const result2 = validateRssUrl("https://example.com/rss");
      expect(result2.isValid).toBe(true);

      const result3 = validateRssUrl("https://example.com/atom.xml");
      expect(result3.isValid).toBe(true);
    });

    it("잘못된 URL에 대해 적절한 에러 메시지를 반환해야 함", () => {
      const result = validateRssUrl("not-a-url");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("유효한 URL 형식이 아닙니다");
    });

    it("빈 문자열에 대해 에러를 반환해야 함", () => {
      const result = validateRssUrl("");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("URL을 입력해주세요");
    });

    it("공백만 있는 문자열에 대해 에러를 반환해야 함", () => {
      const result = validateRssUrl("   ");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("URL을 입력해주세요");
    });

    it("HTTP가 아닌 프로토콜에 대해 에러를 반환해야 함", () => {
      const result = validateRssUrl("ftp://example.com/feed.xml");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("HTTP 또는 HTTPS URL만 지원됩니다");
    });

    it("URL에서 앞뒤 공백을 제거해야 함", () => {
      const result = validateRssUrl("  https://example.com/feed.xml  ");
      expect(result.isValid).toBe(true);
      expect(result.cleanUrl).toBe("https://example.com/feed.xml");
    });
  });
});
