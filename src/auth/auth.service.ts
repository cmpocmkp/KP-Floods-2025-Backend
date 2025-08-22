import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { GoogleLoginDto } from './dtos/google-log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUserId(username);

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    const passwordCorrect = await bcrypt.compare(pass, user.password);

    if (!passwordCorrect) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (user.is_disabled) {
      throw new BadRequestException('Restricted User');
    }

    const { password, ...result } = user;
    const payload = { username: user.user_id, sub: user.id };
    return {
      status: true,
      statusCode: 200,
      access_token: this.jwtService.sign(payload),
      message: 'Login Successful',
      user: result,
    };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<any> {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCorrect) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await this.usersService.updateUser(userId, { password: hashedPassword });

    return {
      status: true,
      statusCode: 200,
      message: 'Password changed successfully'
    };
  }

  // async signUpUser(body: SignUpUserDto) {

  //   // Check if email already exists
  //   const emailExists = await this.usersService.getUserByEmail(body.email);
  //   if (emailExists) {
  //     throw new ConflictException('Email already in use');
  //   }

  //   // Check if phone number already exists
  //   const phoneExists = await this.usersService.getUserByPhoneNumber(body.country_code, body.phone_no)
  //   if (phoneExists) {
  //     throw new ConflictException('Phone number already in use');
  //   }

  //   await this.otpService.validateOtp(body.email, body.otp);

  //   const user = await this.usersService.insertUser(body);

  //   const access_token = await this.jwtService.sign({
  //     userName: user.first_name,
  //     sub: user.id,
  //   });

  //   return { access_token: access_token, user: user };
  // }

  // async forgotPassword(
  //   email: string,
  // ): Promise<{ message: string; data: { id: number; email: string } }> {
  //   const user = await this.usersService.getUserByEmail(email.toLowerCase());

  //   if (!user) {
  //     throw new NotFoundException('User with this email does not exist.');
  //   }

  //   const otpRecord = await this.otpService.sendForgotPasswordEmailOtp(email);

  //   return {
  //     message: `A password reset OTP has been sent to your email (${user.email}).`,
  //     data: { id: user.id, email: user.email },
  //   };
  // }

  // async login(googleLoginDto: GoogleLoginDto): Promise<any> {
  //   // Logic for storing/retrieving user data from the database.
  //   const { first_name, last_name, email, phone_no, image } = googleLoginDto;

  //   // Example: Use an ORM like TypeORM or Prisma to interact with the PostgreSQL database.
  //   // Check if the user exists in the database.
  //   const user = await this.usersService.getUserByEmail(email);

  //   let new_user;

  //   if (!user) {
  //     // Create a new user if not found.
  //     let newUser = await this.usersService.insertGoogleUser({
  //       first_name,
  //       last_name,
  //       email,
  //       phone_no,
  //       image,
  //     });

  //     new_user = true

  //     const payload = { username: user.first_name, sub: user.id };

  //     const { password, ...result } = newUser;

  //     return {
  //       status: true,
  //       statusCode: 200,
  //       access_token: this.jwtService.sign(payload),
  //       message: 'Login Successful',
  //       user: result,
  //     };
  //   }

  //   new_user = false
  //   const payload = { username: user.first_name, sub: user.id };

  //   const { password, ...result } = user;

  //   return {
  //     status: true,
  //     statusCode: 200,
  //     access_token: this.jwtService.sign(payload),
  //     message: 'Login Successful',
  //     user: result,
  //     onboarding_completed: user?.city && user?.country ? true : false,
  //     is_new_user: new_user
  //   };
  // }

  // async resetPassword(body: ResetPasswordDto): Promise<{ message: string }> {
  //   const { email, otp, new_password } = body;

  //   const user = await this.usersService.getUserByEmail(email)

  //   if (!user) {
  //     throw new BadRequestException('User does not exist on the email')
  //   }

  //   const otpValid = await this.otpService.validateOtp(user.email, otp);
  //   if (!otpValid) {
  //     throw new ConflictException('Invalid or expired OTP');
  //   }

  //   const hashedPassword = await bcrypt.hash(new_password, 10);

  //   await this.usersService.updateUser(user?.id, {
  //     password: hashedPassword,
  //   });

  //   return { message: 'Password reset successfully.' };
  // }
}
