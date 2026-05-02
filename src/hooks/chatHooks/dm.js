export const dmTopic = (idA, idB) => {
  const ids = [idA, idB].sort();
  return `dm:${ids[0]}:${ids[1]}`;
};
