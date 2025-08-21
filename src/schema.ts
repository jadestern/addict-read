/**
 * Learn about schemas here:
 * https://jazz.tools/docs/react/schemas/covalues
 */

import { co, Group, z } from "jazz-tools";

/** The account profile is an app-specific per-user public `CoMap`
 *  where you can store top-level objects for that user */
export const JazzProfile = co.profile({
  /**
   * Learn about CoValue field/item types here:
   * https://jazz.tools/docs/react/schemas/covalues#covalue-fielditem-types
   */
  firstName: z.string(),

  // Add public fields here
});

/** The account root is an app-specific per-user private `CoMap`
 *  where you can store top-level objects for that user */
/** RSS 피드 스키마 - 로컬 우선, 나중에 계정 연결 가능 */
export const RSSFeed = co.map({
  url: z.string(),
  title: z.string(),
  // 나중에 계정 연결 시 사용할 구멍
  userId: z.string().optional(),
});

/** 기사 스키마 - 로컬 우선, 나중에 계정 연결 가능 */
export const Article = co.map({
  title: z.string(),
  url: z.string(),
  feedUrl: z.string(),
  pubDate: z.string(),
  description: z.string().optional(), // 기사 전문 내용
  isRead: z.boolean().default(false),
  // 나중에 계정 연결 시 사용할 구멍
  userId: z.string().optional(),
});

export const AccountRoot = co.map({
  dateOfBirth: z.date(),
  // 로그인 후 기존 로컬 데이터 연결용 구멍들
  importedFeeds: co.list(RSSFeed).optional(),
  importedArticles: co.list(Article).optional(),
});

export function getUserAge(root: co.loaded<typeof AccountRoot> | undefined) {
  if (!root) return null;
  return new Date().getFullYear() - root.dateOfBirth.getFullYear();
}

// 로컬 상태에서 사용할 타입 정의
export type LocalFeed = {
  id: string;
  url: string;
  title: string;
};

export type LocalArticle = {
  id: string;
  title: string;
  url: string;
  feedUrl: string;
  pubDate: string;
  isRead: boolean;
};

// RSS 파싱 API 응답 타입
export type ParsedFeed = {
  title: string;
  url: string;
  articles: ParsedArticle[];
};

export type ParsedArticle = {
  title: string;
  link: string;
  pubDate: string;
  description?: string; // 기사 설명/내용
};

export const JazzAccount = co
  .account({
    profile: JazzProfile,
    root: AccountRoot,
  })
  .withMigration(async (account) => {
    /** The account migration is run on account creation and on every log-in.
     *  You can use it to set up the account root and any other initial CoValues you need.
     */
    if (account.root === undefined) {
      const group = Group.create();

      account.root = AccountRoot.create(
        {
          dateOfBirth: new Date("1/1/1990"),
          importedFeeds: co.list(RSSFeed).create([], group),
        },
        group
      );
    }

    if (account.profile === undefined) {
      const group = Group.create();
      group.addMember("everyone", "reader"); // The profile info is visible to everyone

      account.profile = JazzProfile.create(
        {
          name: "Anonymous user",
          firstName: "",
        },
        group
      );
    }
  });
