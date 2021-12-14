import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from '../error/error.codes';
import { ErrorCodesEnum } from '@erp/constants';

@Injectable()
export class SignInWithCredentialsGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      await super.logIn(request);

      return true;
    } catch (e) {
      throw new ErrorCode(ErrorCodesEnum.INVALID_CREDENTIALS);
    }
  }
}
