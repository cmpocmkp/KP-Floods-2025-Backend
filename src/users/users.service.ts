import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignUpUserDto } from 'src/auth/dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from 'src/auth/dtos/google-log-in.dto';
import { UserOnboardingDto } from './dtos/user-onboarding.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }


  async getUserByPhoneNumber(country_code: string, phone_no: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { country_code: country_code, phone_no: phone_no },
    });

    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user with the provided DTO (e.g., new password)
    const updatedUser = Object.assign(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  async insertUser(createUserDto: SignUpUserDto): Promise<User> {
    const { email, phone_no, password, ...rest } = createUserDto;



    // Hash password with bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user entity
    const user = this.userRepository.create({
      ...rest,
      email,
      phone_no,
      is_disabled: false,
      email_verified: true,
      password: hashedPassword,
    });

    // Save the user and return
    return await this.userRepository.save(user);
  }

  async insertGoogleUser(createUserDto: GoogleLoginDto): Promise<User> {
    const { email, phone_no, ...rest } = createUserDto;

    // Create new user entity
    const user = this.userRepository.create({
      ...rest,
      email,
      phone_no,
    });

    // Save the user and return
    return await this.userRepository.save(user);
  }

  async findUser(user): Promise<Partial<User>> {
    return this.userRepository.findOne({
      where: { id: user.userId },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'country_code',
        'phone_no',
        'is_google',
        'image',
        'email_verified',
        'city',
        'state',
        'country',
        'dob',
        'gender',
      ],
    });
  }

  async onboardUser(user, userOnboardingDto: UserOnboardingDto): Promise<User> {
    const users = await this.userRepository.findOne({
      where: { id: user.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${user.userId} not found`);
    }

    // Update user with onboarding fields
    const updatedUser = this.userRepository.merge(users, userOnboardingDto);
    return await this.userRepository.save(updatedUser);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Ensure user exists
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id); // Return updated user
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async markEmailAsVerified(userId): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }

    user.email_verified = true;
    user.is_disabled = false;
    await this.userRepository.save(user);
  }
}
