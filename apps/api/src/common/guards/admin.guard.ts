import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ErrorCode } from '../error/error.codes';
import { ErrorCodesEnum } from '@erp/constants';
import { AuthService } from '../../app/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.session.passport.user;
    if (await this.authService.isAdminRole(userId)) {
      return true;
    } else {
      throw new ErrorCode(ErrorCodesEnum.FORBIDDEN);
    }
  }
}
