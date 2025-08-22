import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignUpUserDto } from './dtos/sign-up-user.dto';
import * as bcrypt from 'bcrypt';
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

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
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
    const { user_id, password, initial_password, ...rest } = createUserDto;

    // Check if user_id already exists
    const existingUser = await this.getUserByUserId(user_id);
    if (existingUser) {
      throw new ConflictException(`User with ID ${user_id} already exists`);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    let hashedInitialPassword = null;
    if (initial_password) {
      hashedInitialPassword = await bcrypt.hash(initial_password, salt);
    }

    // Create new user entity
    const user = this.userRepository.create({
      ...rest,
      user_id,
      password: hashedPassword,
      initial_password: hashedInitialPassword,
      is_disabled: false,
      is_deleted: false,
      first_login: true,
      data_id: createUserDto.data_id || 4,
    });

    // Save the user and return
    return await this.userRepository.save(user);
  }

  async findUser(user): Promise<Partial<User>> {
    return this.userRepository.findOne({
      where: { id: user.userId },
      select: [
        'id',
        'user_id',
        'user_name',
        'email',
        'description',
        'jurisdiction',
        'role',
        'is_disabled',
        'is_deleted',
        'first_login',
        'data_id',
        'created_at',
        'updated_at',
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

  async activateUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }

    user.is_disabled = false;
    await this.userRepository.save(user);
  }

  async markFirstLoginComplete(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }

    user.first_login = false;
    await this.userRepository.save(user);
  }
}
