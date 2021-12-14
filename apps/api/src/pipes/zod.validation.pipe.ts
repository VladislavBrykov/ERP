import {Injectable, PipeTransform} from "@nestjs/common";
import {ZodSchema} from "zod";

import {SignUpRequestBodyDto} from "../app/auth/dto/sign-up.request.body.dto";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<SignUpRequestBodyDto>) {
  }

  transform(value: SignUpRequestBodyDto) {
     if (this.schema.parse(value)) {
       return value;
     }
  }
}
