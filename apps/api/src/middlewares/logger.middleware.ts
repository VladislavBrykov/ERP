import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';

const redis = new Redis();

@Injectable()
export default class LoggingMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if ((await redis.get('sess:' + req.cookies.sessionID)) !== null)
      res.redirect('/api');
    else next();
  }
}
