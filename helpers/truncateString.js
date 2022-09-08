export function truncateString(str, num) {
  if (!str && !str.trim()) return;
  if (str && str?.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}
