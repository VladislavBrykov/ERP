import { HttpStatus } from '@nestjs/common';
import { ErrorCodesEnum } from '@erp/constants';


export interface IErrorMessage {
  type: ErrorCodesEnum;
  httpStatus: HttpStatus;
  userMessage: string;
}
