import { HttpStatus } from '@nestjs/common';

import { ErrorCodesEnum } from '../../constants/error.codes.enum';
import { IErrorMessage } from './i.error.message';
import {ErrorMessages} from "../../constants/error.messages";

export class ErrorCode extends Error {
  public errorCode: ErrorCodesEnum;
  public httpStatus: number;
  public userMessage: string;

  constructor(errorCode: ErrorCodesEnum) {
    super();
    const errorMessageConfig: IErrorMessage = this.getError(errorCode);
    if (!errorMessageConfig)
      throw new Error(ErrorMessages.UNKNOWN_ERROR);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.errorCode = errorCode;
    this.userMessage = errorMessageConfig.userMessage;
  }

  private getError(errorCode: ErrorCodesEnum): IErrorMessage {
    let res: IErrorMessage;

    switch (errorCode) {
      case ErrorCodesEnum.NOT_IN_SESSION:
        res = {
          type: ErrorCodesEnum.NOT_IN_SESSION,
          httpStatus: HttpStatus.UNAUTHORIZED,
          userMessage: ErrorMessages.UNAUTHORIZED,
        };
        break;
      case ErrorCodesEnum.INVALID_CREDENTIALS:
        res = {
          type: ErrorCodesEnum.INVALID_CREDENTIALS,
          httpStatus: HttpStatus.UNAUTHORIZED,
          userMessage: ErrorMessages.INVALID_CREDENTIALS,
        };
        break;
      case ErrorCodesEnum.VALIDATION_FAILED:
        res = {
          type: ErrorCodesEnum.VALIDATION_FAILED,
          httpStatus: HttpStatus.FORBIDDEN,
          userMessage: ErrorMessages.VALIDATION_FAILED,
        };
        break;
      case ErrorCodesEnum.INTERNAL_SERVER_ERROR:
        res = {
          type: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          userMessage: ErrorMessages.INTERNAL_SERVER_ERROR,
        };
        break;
    }
    return res;
  }
}
