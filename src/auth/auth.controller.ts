import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dtos/sign-up.dto';
import { GoogleLoginDto } from './dtos/google-log-in.dto';
import { LoginDto } from './dtos/log-in.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * The purpose of this method is to log in user
   * @param body receives the body of the type LoginDto that validates the post request
   * according to the rules defined in validation pipe i.e LoginDto
   * @returns the auth access token
   */
  //@UseGuards(JWTAuthGuard)
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBody({ type: LoginDto })
  @Post('log-in')
  async login(@Body() body: LoginDto) {
    const createAuth = await this.authService.validateUser(
      body.email,
      body.password,
    );
    return createAuth;
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
}
