import * as bcrypt from 'bcrypt';

export function hash(password): string {
  return bcrypt.hashSync(password, process.env.BCRYPT_HASH);
}

export function isCorrectPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
