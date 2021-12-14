import { z } from 'zod';
import { SignInResponseValidation } from '@erp/validation';

import { User } from '../../../entities/User';
import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto
  implements z.infer<typeof SignInResponseValidation>
{
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      isAdmin: { type: 'boolean' },
    },
  })
  user!: User;

  @ApiProperty({ type: 'string' })
  expireTime!: Date;

  @ApiProperty({ type: 'string' })
  sessionId!: string;
}
