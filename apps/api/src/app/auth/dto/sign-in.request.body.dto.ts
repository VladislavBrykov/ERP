import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { SignInRequestBodyValidation } from '@erp/validation';

export class SignInRequestBodyDto
  implements z.infer<typeof SignInRequestBodyValidation>
{
  @ApiProperty({ default: 'team@bandapixels.com', type: 'string' })
  email!: string;

  @ApiProperty({ default: 'admin-password', type: 'string' })
  password!: string;
}
