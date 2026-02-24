import { Injectable } from '@nestjs/common';
import { pool } from '../db';
import { generateEmbedding } from '../embedding/embedding.client';

@Injectable()
export class SearchService {
  async semanticSearch(query: string, limit = 5) {
    if (!query || !query.trim()) {
      return [];
    }

    // 1. Generate embedding for the query
    const embedding = await generateEmbedding(query);

    // IMPORTANT:
    // pgvector expects either:
    // - explicit ::vector cast
    // - OR a stringified vector "[...]"
    const embeddingStr = JSON.stringify(embedding);

    // 2. Vector similarity search
    const { rows } = await pool.query(
      `
      SELECT
        dc.id,
        dc.content,
        1 - (dc.embedding <=> $1::vector) AS similarity
      FROM "DocumentChunk" dc
      ORDER BY dc.embedding <=> $1::vector
      LIMIT $2
      `,
      [embeddingStr, limit],
    );

    return rows;
  }
}