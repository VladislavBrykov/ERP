import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodesEnum } from '@erp/constants';
import { ZodError } from 'zod';

import { ErrorCode } from '../error/error.codes';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: ZodError | HttpException | ErrorCode, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ZodError && exception.issues) {
      return response.status(HttpStatus.UNAUTHORIZED).json(exception.issues);
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
