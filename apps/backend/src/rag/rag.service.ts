import { Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { generateAnswer } from '../llm/llm.client';

@Injectable()
export class RagService {
  constructor(private readonly searchService: SearchService) {}

  async ask(question: string) {
    const results = await this.searchService.semanticSearch(question, 5);

    const context = results
      .map(r => r.content)
      .join('\n');

    const answer = await generateAnswer(question, context);

    return {
      question,
      answer,
      sources: results,
    };
  }
}