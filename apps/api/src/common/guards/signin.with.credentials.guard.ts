import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInValidation } from '../../app/auth/validations/sign-in.validation';

@Injectable()
export class SignInWithCredentialsGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    SignInValidation.parse(context.switchToHttp().getRequest().body)
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return true;
  }
}
