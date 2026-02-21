export interface Chunk {
  content: string;
  index: number;
}

export function chunkText(
  text: string,
  chunkSize = 500,
  overlap = 100,
): Chunk[] {
  const chunks: Chunk[] = [];

  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    const slice = text.slice(start, end).trim();

    if (slice.length > 0) {
      chunks.push({
        content: slice,
        index,
      });
      index++;
    }

    start += chunkSize - overlap;
  }

  return chunks;
}
