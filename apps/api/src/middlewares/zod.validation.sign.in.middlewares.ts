import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SignInRequestBodyValidation } from '@erp/validation';

@Injectable()
export class ZodValidationForSignInMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    SignInRequestBodyValidation.parse(req.body);
    next();
  }
}
