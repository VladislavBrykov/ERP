import { Request, Response } from 'express';
import faker from 'faker';
import mocks from 'node-mocks-http';

import { ZodValidationMiddleware } from '../../../middlewares/zod.validation.sign.in.middlewares';
import CheckSessionIdExistsMiddlewares from '../../../middlewares/check.sessionId.exists.middlewares';

describe('Authorization middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  const next = jest.fn();
  const zodValidationMiddleware = new ZodValidationMiddleware();
  const checkSessionIdExistsMiddleware = new CheckSessionIdExistsMiddlewares();

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
    };
  });

  describe('zod validation middleware', () => {
    test('should be defined', () => {
      expect(zodValidationMiddleware).toBeDefined();
    });

    test('zod validation successful', async () => {
      mockRequest = {
        body: {
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        },
      };

      expect(
        await zodValidationMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          next
        )
      );
      expect(next).toBeCalledTimes(1);
    });
  });

  describe('check sessionID middleware', () => {
    test('should be defined', () => {
      expect(checkSessionIdExistsMiddleware).toBeDefined();
    });

    test('check sessionID middleware', async () => {
      const req = mocks.createRequest({
        isAuthenticated: () => true,
      });
      const res = mocks.createResponse();
      const next = jest.fn();

      expect(await checkSessionIdExistsMiddleware.use(req, res, next));
      expect(next).toBeCalledTimes(0);
    });

    test('check sessionID middleware when isAuth is false', async () => {
      const req = mocks.createRequest({
        isAuthenticated: () => false,
      });
      const res = mocks.createResponse();
      const next = jest.fn();

      expect(await checkSessionIdExistsMiddleware.use(req, res, next));
      expect(next).toBeCalledTimes(1);
    });
  });
});
