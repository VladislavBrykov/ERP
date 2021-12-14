import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards, UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorCodesEnum } from '@erp/constants';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { SignInWithCredentialsGuard } from '../../common/guards/signin.with.credentials.guard';
import { SignInRequestBodyDto } from './dto/sign-in.request.body.dto';
import { CookieAuthenticationGuard } from '../../common/guards/cookie.auth.guard';
import { SignInResponseDto } from './dto/sign-in.response.dto';
import { SignUpRequestBodyDto } from './dto/sign-up.request.body.dto';
import { ZodValidationPipe } from '../../pipes/zod.validation.pipe';
import { RolesGuard } from '../../common/guards/admin.guard';
import { SignUpRequestBodyValidation } from '@erp/validation';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignInRequestBodyDto })
  @ApiFoundResponse({ description: 'Redirect to /api' })
  @ApiCreatedResponse({
    description: 'Successfully sign in',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: ErrorCodesEnum.INVALID_CREDENTIALS,
  })
  @ApiInternalServerErrorResponse({
    description: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
  })
  @Post('/sign-in')
  @UseGuards(SignInWithCredentialsGuard)
  async signIn(@Body() signInDto: SignInRequestBodyDto, @Req() req: Request) {
    return this.authService.getAuthUser(
      signInDto,
      req.session.cookie.expires as Date,
      req.sessionID
    );
  }

  @ApiNoContentResponse({ description: 'Successfully sign out' })
  @ApiUnauthorizedResponse({
    description: ErrorCodesEnum.NOT_IN_SESSION,
  })
  @ApiInternalServerErrorResponse({
    description: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
  })
  @Get('/sign-out')
  @HttpCode(204)
  @UseGuards(CookieAuthenticationGuard)
  async signOut(@Req() req: Request) {
    req.logOut();
  }

  @ApiBody({type: SignUpRequestBodyDto})
  @ApiCreatedResponse({description: 'Successfully created'})
  @ApiUnauthorizedResponse({
    description: ErrorCodesEnum.NOT_IN_SESSION,
  })
  @ApiInternalServerErrorResponse({
    description: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
  })
  @UseGuards(CookieAuthenticationGuard, RolesGuard)
  @UsePipes(new ZodValidationPipe(SignUpRequestBodyValidation))
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpRequestBodyDto) {
    return this.authService.createUser(signUpDto);
  }
}
