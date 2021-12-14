import { z } from 'zod';

export const EnvValidation = z.object({
  PORT: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
  NODE_ENV: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  BCRYPT_HASH: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
  SECRET_KEY_SESSION: z.string().min(1),
  REDIS_EXPIRE_TIME: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
  SESSION_EXPIRE_TIME: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
});
