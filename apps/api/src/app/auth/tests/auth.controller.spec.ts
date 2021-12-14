// eslint-disable-next-line @typescript-eslint/no-unused-vars
import expressSession from 'express-session';
import { Test, TestingModule } from '@nestjs/testing';
import mocks from 'node-mocks-http';
import faker from 'faker';
import { Request } from 'express';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../entities/User';
import { SignInRequestBodyDto } from '../dto/sign-in.request.body.dto';

describe('AppController', () => {
  let controller: AuthController;
  let findOne: jest.Mock;

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
  });

  const date = faker.date.future();
  const sessionID = faker.random.alphaNumeric(10);

  const req: Request = {
    body: {
      email: 'string',
      password: 'string',
    },
    session: {
      cookie: {
        expires: date,
      },
    },
    sessionID: sessionID,
  } as Request;

  it('should call signIn method with expected params', async () => {
    const createAuthSpy = jest.spyOn(controller, 'signIn');
    const dto = new SignInRequestBodyDto();

    await controller.signIn(dto, req);
    expect(createAuthSpy).toHaveBeenCalledWith(dto, req);
  });

  it('should call signOut method', async () => {
    const createAuthSpy = jest.spyOn(controller, 'signOut');
    const req = mocks.createRequest({
      logOut: () => true,
    });
    await controller.signOut(req);
    expect(createAuthSpy).toHaveBeenCalledWith(req);
  });

  describe('when call signIn method', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      findOne.mockReturnValue(Promise.resolve(user));
    });

    it('should return signInResponseDto', async () => {
      const signInResponse = await controller.signIn(
        {
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        },
        req
      );
      expect(signInResponse).toEqual({
        expireTime: date,
        sessionId: sessionID,
        user,
      });
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
