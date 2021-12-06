import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ErrorCode } from '../common/error/error.codes';
import { ErrorCodesEnum } from '../constants/error.codes.enum';

@Injectable()
export class ZodValidationMiddleware implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.parse(value);
    if (error) {
      throw new ErrorCode(ErrorCodesEnum.VALIDATION_FAILED);
    }
    return value;
  }
}
