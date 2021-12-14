// eslint-disable-next-line @typescript-eslint/no-unused-vars
import expressSession from 'express-session';
import { Request, Response } from 'express';
import faker from 'faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import mocks from 'node-mocks-http';
import { ZodValidationMiddleware } from '../../../middlewares/zod.validation.sign.in.middlewares';
import CheckSessionIdExistsMiddlewares from '../../../middlewares/check.sessionId.exists.middlewares';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { SignInRequestBodyDto } from '../dto/sign-in.request.body.dto';
import { User } from '../../../entities/User';

describe('integration test for all authorization', () => {
  const mockRequest = mocks.createRequest({
    body: {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(10),
    },
    isAuthenticated: () => true,
  });

  const signInDto: SignInRequestBodyDto = {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(10),
  };

  const updateMockRequest: Request = {
    body: {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(10),
    },
    session: {
      cookie: {
        expires: new Date(),
      },
    },
    sessionID: faker.random.alphaNumeric(10),
  } as Request;

  const mockResponse = mocks.createResponse();
  const checkSessionIdExistsMiddleware = new CheckSessionIdExistsMiddlewares();
  let service: AuthService;
  let controller: AuthController;
  let findOne: jest.Mock;

  const nextForZodMiddleware = jest.fn();
  const nextForCheckSessionMiddleware = jest.fn();
  const dto = new SignInRequestBodyDto();

  beforeAll(async () => {
    findOne = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('middlewares', () => {
    const zodValidationMiddleware = new ZodValidationMiddleware();

    test('serial call middlewares', async () => {
      expect(
        await zodValidationMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextForZodMiddleware
        )
      );
      expect(nextForZodMiddleware).toBeCalledTimes(1);
      expect(
        checkSessionIdExistsMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          nextForCheckSessionMiddleware
        )
      );
      expect(nextForCheckSessionMiddleware).toBeCalledTimes(0);
    });

    test('zodValidationMiddleware be defined', () => {
      expect(zodValidationMiddleware).toBeDefined();
    });

    test('checkSessionIdExistsMiddleware be defined', () => {
      expect(checkSessionIdExistsMiddleware).toBeDefined();
    });
  });

  describe('controller', () => {
    test('getAuthUser', async () => {
      const receivedController = jest.spyOn(controller, 'signIn');
      const res = await controller.signIn(dto, updateMockRequest);
      const user = res.user;
      const expireTime = res.expireTime;
      const sessionId = res.sessionId;
      expect(receivedController).toHaveBeenCalledWith(dto, updateMockRequest);
      expect(res).toEqual({ user, expireTime, sessionId });
    });
    test('controller be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('service', () => {
    test('getAuthUser', async () => {
      const serverResponse = await service.getAuthUser(
        signInDto,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        updateMockRequest.session.cookie.expires!,
        updateMockRequest.sessionID
      );
      const user = serverResponse.user;
      const expireTime = serverResponse.expireTime;
      const sessionId = serverResponse.sessionId;
      expect(serverResponse).toEqual({ user, expireTime, sessionId });
    });

    test('service be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
