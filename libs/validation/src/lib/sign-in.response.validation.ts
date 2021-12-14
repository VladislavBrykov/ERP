import { z } from 'zod';

export const SignInResponseValidation = z.object({
  user: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    isAdmin: z.boolean(),
  }),
  expireTime: z.date(),
  sessionId: z.string(),
});
