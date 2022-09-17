// Convert date to how many minutes, hours, days, months, years ago
export const getTimeAgo = (date: string) => {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = now - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const months = Math.floor(diff / 1000 / 60 / 60 / 24 / 30);
  const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 30 / 12);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
}
