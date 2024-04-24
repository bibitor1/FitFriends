import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { FileService } from './file.service';
import { fillObject } from '@fit-friends/core';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/upload/video')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadVideoFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.saveAndReturnPath(file, 'video');
  }

  @Post('/upload/img')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImageFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.saveAndReturnPath(file, 'image');
  }

  @Post('/upload/pdf')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadPDFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.saveAndReturnPath(file, 'pdf');
  }

  @Get(':id')
  public async show(@Param('id') id: number) {
    const existFile = await this.fileService.getFileById(id);
    const path = `${this.configService.get('application.serveRoot')}${
      existFile.path
    }`;
    return fillObject(UploadedFileRdo, Object.assign(existFile, { path }));
  }
}
