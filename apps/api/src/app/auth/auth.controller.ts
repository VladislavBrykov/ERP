import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInWithCredentialsGuard } from '../../common/guards/signin.with.credentials.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignInDto })
  @Post('/sign-in')
  @UseGuards(SignInWithCredentialsGuard)
  async signIn(@Body() signInDto: SignInDto, @Req() req: Request) {
    return this.authService.getAuthUser(
      signInDto,
      req.session.cookie.expires,
      req.sessionID
    );
  }
}
