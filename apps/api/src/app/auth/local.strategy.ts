import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from '../../entities/User';
import { ErrorCode } from '../../common/error/error.codes';
import { ErrorCodesEnum } from '../../constants/error.codes.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new ErrorCode(ErrorCodesEnum.INVALID_CREDENTIALS);
    }
    return user;
  }
}
