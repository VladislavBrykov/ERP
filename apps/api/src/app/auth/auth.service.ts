import { Injectable } from '@nestjs/common';

import { SignInDto } from './dto/sign-in.dto';
import { isCorrectPassword } from './Helpers/hash.password';
import { SignInEndpointDto } from './dto/sign-in.endpoint.dto';
import { IUser } from '../../interfaces/user.interface';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async getAuthUser(
    signInDto: SignInDto,
    expireTime: Date,
    sessionId: string
  ): Promise<SignInEndpointDto> {
    const user = await this.userRepository.findOne({
      email: signInDto.email,
    });

    return { user, expireTime, sessionId };
  }

  async validateUser(signInDto: SignInDto): Promise<IUser> {
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
}
