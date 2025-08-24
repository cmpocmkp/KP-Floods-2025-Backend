import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../app/swagger.constant';
import { FileUploadService } from './file-upload.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
@ApiTags('file-upload')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) { }

  @Post('file')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadAnyFile(@UploadedFile() file) {
    try {
      const fileName = file.originalname;
      const data = await this.fileUploadService.uploadFile(
        file.buffer,
        fileName,
      );
      return {
        status: data ? true : false,
        statusCode: data ? 201 : 400,
        message: data ? 'File uploaded successfully' : 'Bad Request',
        data: data ? data : null,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @ApiBearerAuth(AuthorizationHeader)
  // @UseGuards(JWTAuthGuard)
  @Post('multiple')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  async uploadImages(@UploadedFiles() files) {
    return await this.fileUploadService.uploadFiles(files);
  }
}
