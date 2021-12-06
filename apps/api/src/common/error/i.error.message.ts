import { HttpStatus } from '@nestjs/common';

import { ErrorCodesEnum } from '../../constants/error.codes.enum';

export interface IErrorMessage {
  type: ErrorCodesEnum;
  httpStatus: HttpStatus;
  userMessage: string;
}
