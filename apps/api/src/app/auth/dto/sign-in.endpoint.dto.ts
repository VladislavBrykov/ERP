import { IUser } from '../../../interfaces/user.interface';

export class SignInEndpointDto {
  user: IUser;
  expireTime: Date;
  sessionId: string;
}
