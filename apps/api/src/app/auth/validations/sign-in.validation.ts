import { z } from 'zod';
import {ErrorMessages} from "../../../constants/error.messages";

export const SignInValidation = z.object({
  email: z.string().email({ message: ErrorMessages.INVALID_EMAIL }),
  password: z.string().min(10),
});
