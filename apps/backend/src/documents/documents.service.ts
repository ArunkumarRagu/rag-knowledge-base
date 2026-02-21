import { Injectable, BadRequestException } from '@nestjs/common';
import { pool } from '../db';
import { randomUUID } from 'crypto';
import { chunkText } from '../chunking/chunker';

@Injectable()
export class DocumentsService {
  async ingest(file: Express.Multer.File) {
    if (!file.mimetype.startsWith('text/')) {
      throw new BadRequestException('Only text files are supported');
    }

    const text = file.buffer.toString('utf-8').trim();
    if (!text) {
      throw new BadRequestException('Empty file');
    }

    const documentId = randomUUID();

    // 1️⃣ Insert Document
    await pool.query(
      `
      INSERT INTO "Document"(id, title, source, "createdAt")
      VALUES ($1, $2, $3, now())
      `,
      [documentId, file.originalname, file.mimetype],
    );

    // 2️⃣ Chunk text
    const chunks = chunkText(text);

    // 3️⃣ Insert chunks
    for (const chunk of chunks) {
      await pool.query(
        `
        INSERT INTO "DocumentChunk"(id, "documentId", content, "createdAt")
        VALUES ($1, $2, $3, now())
        `,
        [randomUUID(), documentId, chunk.content],
      );
    }

    return {
      documentId,
      chunksCreated: chunks.length,
    };
  }

  async getAllDocuments() {
    const { rows } = await pool.query(
      `SELECT * FROM "Document" ORDER BY "createdAt" DESC`,
    );
    return rows;
  }

  async getDocument(id: string) {
    const doc = await pool.query(`SELECT * FROM "Document" WHERE id = $1`, [
      id,
    ]);

    const chunks = await pool.query(
      `SELECT * FROM "DocumentChunk" WHERE "documentId" = $1`,
      [id],
    );

    return {
      document: doc.rows[0],
      chunks: chunks.rows,
    };
  }

  async deleteDocument(id: string) {
    await pool.query(`DELETE FROM "DocumentChunk" WHERE "documentId" = $1`, [
      id,
    ]);
    await pool.query(`DELETE FROM "Document" WHERE id = $1`, [id]);
    return { deleted: true };
  }
}
