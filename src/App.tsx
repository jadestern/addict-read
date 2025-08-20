import { useAccount, useIsAuthenticated } from "jazz-tools/react";
import { Group } from "jazz-tools";
import { RssUrlForm } from "./components/RssUrlForm.tsx";
import { AuthButton } from "./AuthButton.tsx";
import { JazzAccount, RSSFeed } from "./schema.ts";

function App() {
  const { me } = useAccount(JazzAccount, {
    resolve: { profile: true, root: { importedFeeds: true } },
  });
  const isAuthenticated = useIsAuthenticated();

  const handleRssSubmit = (url: string) => {
    if (!me?.root?.importedFeeds) return;

    // 이미 있는 URL인지 확인
    const existingFeed = me.root.importedFeeds.find(feed => feed?.url === url);
    if (existingFeed) {
      alert("이미 구독 중인 피드입니다!");
      return;
    }

    // 새 RSS 피드 추가 - 개인 그룹 생성
    const privateGroup = Group.create();
    privateGroup.addMember(me, "writer");
    
    const newFeed = RSSFeed.create({
      url: url,
      title: `Feed from ${new URL(url).hostname}`,
      userId: me.id,
    }, privateGroup);

    me.root.importedFeeds.push(newFeed);
  };

  return (
    <>
      <header>
        <nav className="max-w-2xl mx-auto flex justify-between items-center p-3">
          <span>Feedic</span>
          <AuthButton />
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-3 mt-16 flex flex-col gap-8">
        <div className="text-center">
          <h1>Feedic</h1>
          <p>RSS 피드를 구독하고 최신 기사를 확인하세요</p>
          {isAuthenticated && me?.profile?.firstName && (
            <p className="text-sm text-gray-600">안녕하세요, {me.profile.firstName}님!</p>
          )}
        </div>

        <RssUrlForm onSubmit={handleRssSubmit} />

        {me?.root?.importedFeeds && me.root.importedFeeds.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">구독 중인 피드:</h3>
            <ul className="space-y-1">
              {me.root.importedFeeds.map((feed, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{feed?.title}</span>
                  <br />
                  <span className="text-gray-600">{feed?.url}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
