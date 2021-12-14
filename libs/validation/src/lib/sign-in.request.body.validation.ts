import { z } from 'zod';
import { ErrorMessages } from '@erp/constants';

export const SignInRequestBodyValidation = z.object({
  email: z.string().email({ message: ErrorMessages.INVALID_EMAIL }),
  password: z.string().min(10),
});
