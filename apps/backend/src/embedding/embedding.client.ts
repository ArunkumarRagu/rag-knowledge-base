import axios from 'axios';

const EMBEDDING_SERVICE_URL = 'http://localhost:8001/embed';

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || !text.trim()) {
    throw new Error('Cannot generate embedding for empty text');
  }

  const response = await axios.post(EMBEDDING_SERVICE_URL, {
    text,
  });

  const embedding = response.data?.embedding;

  if (!Array.isArray(embedding)) {
    throw new Error('Invalid embedding response from embedding service');
  }

  return embedding;
}