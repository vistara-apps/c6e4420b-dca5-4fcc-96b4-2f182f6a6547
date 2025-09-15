import { AppShell } from '../components/AppShell';
import { MatchChatFeed } from '../components/MatchChatFeed';
import { UpcomingTopics } from '../components/UpcomingTopics';

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex-1 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <MatchChatFeed />
        </div>
        
        {/* Sidebar */}
        <div className="w-80 hidden lg:block">
          <UpcomingTopics />
        </div>
      </div>
    </AppShell>
  );
}
