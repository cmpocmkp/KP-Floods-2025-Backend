import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthorizationHeader } from 'src/app/swagger.constant';
import { JWTAuthGuard } from './guards/jwt-auth-guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthService } from './auth.service';
import { DocumentProcessingService } from './document-processing.service';
import { multerConfig } from './config/multer.config';
import { SignUpUserDto } from './dtos/sign-up.dto';
import { GoogleLoginDto } from './dtos/google-log-in.dto';
import { LogInDto } from './dtos/log-in.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private documentProcessingService: DocumentProcessingService,
  ) { }

  /**
   * The purpose of this method is to log in user
   * @param body receives the body of the type LoginDto that validates the post request
   * according to the rules defined in validation pipe i.e LoginDto
   * @returns the auth access token
   */
  //@UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({ type: LogInDto })
  @Post('log-in')
  async login(@Body() body: LogInDto) {
    const createAuth = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return createAuth;
  }

  @Post('change-password')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth(AuthorizationHeader)
  @ApiBody({ type: ChangePasswordDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req['user'].userId;
    return await this.authService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @ApiBody({ type: GoogleLoginDto })
  // @Post('google/log-in')
  // async googleLogin(@Body() body: GoogleLoginDto) {
  //   const createAuth = await this.authService.login(body);
  //   return createAuth;
  // }

  // /**
  //  *
  //  * @param body
  //  * @returns
  //  */
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @ApiBody({ type: SignUpUserDto })
  // @Post('sign-up')
  // async signup(@Body() body: SignUpUserDto) {
  //   const createAuth = await this.authService.signUpUser(body);
  //   return { message: 'User signed up successfully', data: createAuth };
  // }

  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @ApiBody({ type: ForgotPasswordDto })
  // @Post('forgot-password')
  // async forgotPassword(@Body() body: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(body.email);
  // }

  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // @ApiBody({ type: ResetPasswordDto })
  // @Post('reset-password')
  // async resetPassword(@Body() body: ResetPasswordDto) {
  //   return this.authService.resetPassword(body);
  // }

  @Post('process-document')
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
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiConsumes('multipart/form-data')
  async processDocument(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      const result = await this.documentProcessingService.processDocument(file);
      return {
        status: true,
        statusCode: 200,
        message: 'Document processed successfully',
        data: result
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
}
