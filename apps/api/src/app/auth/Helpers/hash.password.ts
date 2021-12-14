import bcrypt from 'bcrypt';
import { EnvValidation } from '@erp/validation';

export async function hash(password: string): Promise<string> {
  const env = EnvValidation.parse(process.env);
  return bcrypt.hash(password, env.BCRYPT_HASH);
}

export async function isCorrectPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
