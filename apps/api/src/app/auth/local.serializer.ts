import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { User } from '../../entities/User';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    done(null, userId);
  }
}
