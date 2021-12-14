import { Injectable } from '@nestjs/common';

import { hash, isCorrectPassword } from './Helpers/hash.password';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInResponseDto } from './dto/sign-in.response.dto';
import { SignInRequestBodyDto } from './dto/sign-in.request.body.dto';
import { SignUpRequestBodyDto } from './dto/sign-up.request.body.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async getAuthUser(
    signInDto: SignInRequestBodyDto,
    expireTime: Date,
    sessionId: string
  ): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOne(
      {
        email: signInDto.email,
      },
      {
        select: ['id', 'firstName', 'lastName', 'email', 'isAdmin'],
      }
    );
    return { user, expireTime, sessionId } as SignInResponseDto;
  }

  async validateUser(
    signInDto: SignInRequestBodyDto
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      email: signInDto.email,
    });
    if (user) {
      const checkPassword = await isCorrectPassword(
        signInDto.password,
        user.password
      );
      if (checkPassword) {
        return user;
      }
    }
  }

  async createUser(signUpDto: SignUpRequestBodyDto) {
    const user = await this.userRepository.create(signUpDto);
    user.password = await hash(user.password);
    return this.userRepository.save(user);
  }

  async isAdminRole(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      id: userId,
    });
    if (user?.isAdmin) {
      return true;
    }
    return false;
  }
}
