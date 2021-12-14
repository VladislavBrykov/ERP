import faker from 'faker';
import { hash, isCorrectPassword } from '../Helpers/hash.password';

describe('hash and isCorrectPassword password', () => {
  const testPassword = faker.random.alphaNumeric(10);

  test('hash password', async () => {
    expect(await hash(testPassword));
  });

  test('isCorrectPassword password', async () => {
    const hashPassword = await hash(testPassword);
    expect(await isCorrectPassword(testPassword, hashPassword)).toBe(true);
  });

  test('incorrect password', async () => {
    const hashPassword = await hash(testPassword);
    expect(
      await isCorrectPassword(faker.random.alphaNumeric(10), hashPassword)
    ).toBe(false);
  });

  test('hash be defined', () => {
    expect(hash).toBeDefined();
  });

  test('isCorrectPassword be defined', () => {
    expect(isCorrectPassword).toBeDefined();
  });
});
