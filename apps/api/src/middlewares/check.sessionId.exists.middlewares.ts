import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export default class CheckSessionIdExistsMiddlewares implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      res.redirect('/api');
    } else {
      next();
    }
  }
}
