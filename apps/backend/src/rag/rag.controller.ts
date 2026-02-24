import { Controller, Get, Query } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Get()
  ask(@Query('q') q: string) {
    return this.ragService.ask(q);
  }
}