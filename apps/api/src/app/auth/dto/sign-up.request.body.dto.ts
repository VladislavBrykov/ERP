import {z} from "zod";
import {SignUpRequestBodyValidation} from "@erp/validation";
import {ApiProperty} from "@nestjs/swagger";

export class SignUpRequestBodyDto implements z.infer<typeof SignUpRequestBodyValidation> {
  @ApiProperty({type: 'string'})
  email!: string;

  @ApiProperty({type: 'string'})
  firstName!: string;

  @ApiProperty({type: 'string'})
  lastName!: string;

  @ApiProperty({type: 'string'})
  password!: string;

  @ApiProperty({type: 'boolean'})
  isAdmin!: boolean;

  @ApiProperty({type: 'string'})
  phone!: string;

  @ApiProperty({type: 'number'})
  role!: number;

  @ApiProperty({type: 'string'})
  passportSeries?: string;

  @ApiProperty({type: 'string'})
  inn?: string;

  @ApiProperty({type: 'string'})
  dateOfBirthday?: string;
}
