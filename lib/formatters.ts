export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatScore(earned: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((earned / total) * 100)}%`;
}

export function getQuizStatusColor(percentage: number): string {
  if (percentage >= 80) return "success";
  if (percentage >= 60) return "warning";
  return "danger";
}
