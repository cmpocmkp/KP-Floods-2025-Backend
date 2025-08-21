import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicR2Url: string;

  constructor() {
    // Initialize S3 client using environment variables
    this.s3Client = new S3Client({
      region: 'auto', // Required for Cloudflare R2
      endpoint: 'https://9ce57ffb6e7c4b1677906b40c2b93275.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: '7cb50e34a1523351dbc2018230c22f01',
        secretAccessKey: 'bac984986c78e4462151632e25c9362be33612b1c8d41de920ebd572ecdaa18e',
      },
    });

    // Load bucket name and public URL from environment variables
    this.bucketName = 'fair-ticket-images-dev';
    this.publicR2Url = 'https://pub-ccfdb073636e4defaa83367976a80214.r2.dev'; // Add this to your .env
  }

  /**
   * Uploads a single file to Cloudflare R2
   * @param file - File buffer
   * @param fileName - Original file name
   */
  async uploadFile(file: Buffer, fileName: string) {
    const uniqueFileName = `${uuidv4()}.${fileName.split('.').pop()}`; // Generate unique file name
    const params = {
      Bucket: this.bucketName,
      Key: uniqueFileName,
      Body: file,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return {
        url: `${this.publicR2Url}/${uniqueFileName}`, // Publicly accessible file URL
      };
    } catch (err) {
      console.error('File upload error:', err);
      throw new Error('File upload failed');
    }
  }

  /**
   * Uploads multiple files to Cloudflare R2
   * @param files - Array of files
   */
  async uploadFiles(files) {
    try {
      const uploadPromises = files.map((file) => {
        const uniqueFileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
        const params = {
          Bucket: this.bucketName,
          Key: uniqueFileName,
          Body: file.buffer,
        };

        return this.s3Client.send(new PutObjectCommand(params)).then(() => ({
          fileName: uniqueFileName,
          url: `${this.publicR2Url}/${uniqueFileName}`, // Public file URL
        }));
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      return {
        status: true,
        statusCode: 201,
        message: `All ${files.length} files have been successfully uploaded!`,
        data: uploadedFiles,
      };
    } catch (err) {
      console.error('Error uploading files:', err);
      return {
        status: false,
        statusCode: 400,
        message: 'Something went wrong, please try again later!',
        data: null,
      };
    }
  }
}
