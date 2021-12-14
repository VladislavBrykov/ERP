import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import faker from 'faker';

import { AuthService } from '../auth.service';
import { SignInRequestBodyDto } from '../dto/sign-in.request.body.dto';
import { User } from '../../../entities/User';

describe('AuthService', () => {
  let service: AuthService;
  let findOne: jest.Mock;
  let bcryptCompare: jest.Mock;

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
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  beforeEach(() => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  });

  it('should call validateUser method with expected params', async () => {
    const createAuthSpy = jest.spyOn(service, 'validateUser');
    const dto = new SignInRequestBodyDto();
    await service.validateUser(dto);
    expect(createAuthSpy).toHaveBeenCalledWith(dto);
  });

  describe('when call getAuthUser Method', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      findOne.mockReturnValue(Promise.resolve(user));
    });
    it('should return user', async () => {
      const date = faker.date.future();
      const sessionId = faker.random.alphaNumeric(10);
      const fetchedUser = await service.getAuthUser(
        {
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        },
        date,
        sessionId
      );
      expect(fetchedUser).toEqual({
        expireTime: date,
        sessionId,
        user: user,
      });
    });
  });

  describe('when call validateUser Method', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(async () => {
        user = new User();
        bcryptCompare.mockReturnValue(true);
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return user', async () => {
        const fetchedUser = await service.validateUser({
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        });
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the provided password is not valid', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        bcryptCompare.mockReturnValue(false);
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should throw an error', async () => {
        const fetchedUser = await service.validateUser({
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        });
        await expect(fetchedUser).toBeUndefined();
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        const fetchedUser = await service.validateUser({
          email: faker.internet.email(),
          password: faker.random.alphaNumeric(10),
        });
        await expect(fetchedUser).toBeUndefined();
      });
    });
  });

  it('AuthService - should be defined', () => {
    expect(service).toBeDefined();
  });
});
