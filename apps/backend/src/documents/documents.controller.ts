import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DocumentsService } from './documents.service'

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.documentsService.ingest(file)
  }

  @Get()
  getAll() {
    return this.documentsService.getAllDocuments()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.documentsService.getDocument(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentsService.deleteDocument(id)
  }
}
