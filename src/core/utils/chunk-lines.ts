export const chunkLines = (
  items: string[],
  limit: number,
  separator = '\n',
): string[] => {
  const chunks: string[] = [];
  let current = '';

  for (const item of items) {
    const candidate = current ? `${current}${separator}${item}` : item;

    if (candidate.length <= limit) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = item.slice(0, limit);
    }
  }

  if (current) chunks.push(current);
  return chunks;
};
