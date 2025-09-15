import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

export function formatMatchTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function generateMockUser(id: string): any {
  const names = ['Alex Chen', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'Chris Brown'];
  const teams = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Tottenham'];
  
  return {
    userId: id,
    username: names[Math.floor(Math.random() * names.length)],
    farcasterId: `fid_${id}`,
    profilePicUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    following: [],
    followers: [],
    teamAffiliations: [teams[Math.floor(Math.random() * teams.length)]],
  };
}
