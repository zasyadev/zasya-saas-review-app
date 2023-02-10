export function truncateString(str, num) {
  if (!str && !str.trim()) return;
  if (str && str?.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export const getFirstTwoLetter = (text) => {
  return text.substring(2, 0);
};
export const getFirstLetter = (text) => {
  if (!text) return "U";
  return text.substring(1, 0);
};
