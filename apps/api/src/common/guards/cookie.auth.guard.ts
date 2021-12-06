import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ErrorCode } from '../error/error.codes';
import { ErrorCodesEnum } from '../../constants/error.codes.enum';

@Injectable()
export class CookieAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAuth = request.isAuthenticated();
    if (!isAuth) {
      throw new ErrorCode(ErrorCodesEnum.NOT_IN_SESSION);
    }
    return isAuth;
  }
}
