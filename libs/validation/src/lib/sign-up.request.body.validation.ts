import { z } from 'zod';

export const SignUpRequestBodyValidation = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(10),
  isAdmin: z.boolean(),
  phone: z.string().min(1),
  role: z.number(),
  passportSeries: z.string().optional(),
  inn: z.string().optional(),
  dateOfBirthday: z.string().optional(),
})
