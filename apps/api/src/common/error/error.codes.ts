import { HttpStatus } from '@nestjs/common';

import { IErrorMessage } from './i.error.message';
import { ErrorCodesEnum } from '@erp/constants';
import { ErrorMessages } from '@erp/constants';

export class ErrorCode extends Error {
  public errorCode: ErrorCodesEnum;
  public httpStatus: number;
  public userMessage: string;

  constructor(errorCode: ErrorCodesEnum) {
    super();
    const errorMessageConfig: IErrorMessage = this.getError(errorCode);
    if (!errorMessageConfig) throw new Error(ErrorMessages.UNKNOWN_ERROR);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.errorCode = errorCode;
    this.userMessage = errorMessageConfig.userMessage;
  }

  private getError(errorCode: ErrorCodesEnum): IErrorMessage {
    const errorCodesMap = {
      [ErrorCodesEnum.NOT_IN_SESSION]: {
        type: ErrorCodesEnum.NOT_IN_SESSION,
        httpStatus: HttpStatus.UNAUTHORIZED,
        userMessage: ErrorMessages.UNAUTHORIZED,
      },
      [ErrorCodesEnum.INVALID_CREDENTIALS]: {
        type: ErrorCodesEnum.INVALID_CREDENTIALS,
        httpStatus: HttpStatus.UNAUTHORIZED,
        userMessage: ErrorMessages.INVALID_CREDENTIALS,
      },
      [ErrorCodesEnum.INTERNAL_SERVER_ERROR]: {
        type: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        userMessage: ErrorMessages.INTERNAL_SERVER_ERROR,
      },
      [ErrorCodesEnum.FORBIDDEN]: {
        type: ErrorCodesEnum.FORBIDDEN,
        httpStatus: HttpStatus.FORBIDDEN,
        userMessage: ErrorMessages.FORBIDDEN,
      },
    };
    return errorCodesMap[errorCode];
  }
}
