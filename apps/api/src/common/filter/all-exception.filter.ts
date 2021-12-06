import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorCode } from '../error/error.codes';
import { ErrorCodesEnum } from '../../constants/error.codes.enum';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.issues) {
      return response.json(exception.issues);
    }

    if (exception instanceof ErrorCode) {
      return response.status(exception.httpStatus).json({
        errorMsg: exception.errorCode,
        userMsg: exception.userMessage,
        httpCode: exception.httpStatus,
      });
    }

    if (
      exception instanceof NotFoundException ||
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException ||
      exception instanceof BadRequestException
    ) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    exception = new ErrorCode(ErrorCodesEnum.INTERNAL_SERVER_ERROR);

    return response.status(exception.httpStatus).json({
      errorMsg: exception.errorCode,
      userMsg: exception.userMessage,
      httpCode: exception.httpStatus,
    });
  }
}
