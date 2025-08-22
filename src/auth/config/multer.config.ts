import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (
      // Document types
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'text/plain' ||
      file.mimetype === 'text/csv' ||
      // Image types
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/webp' ||
      file.mimetype === 'image/heic'
    ) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Unsupported file type. Only PDF, Excel, Word, CSV, text files, and images (JPEG, PNG, WEBP, HEIC) are allowed.',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
};