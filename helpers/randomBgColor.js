export default (index) => {
  return `hsl(${(index * 9) % 360}, 50%, 50%)`;
};
