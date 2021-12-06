import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ default: 'team@bandapixels.com' })
  email: string;

  @ApiProperty({ default: 'admin-password' })
  password: string;
}
