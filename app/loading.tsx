export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-background flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-3xl px-4">
        <div className="h-8 bg-dark-surface rounded-lg w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-5/6"></div>
          <div className="h-4 bg-dark-surface rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
