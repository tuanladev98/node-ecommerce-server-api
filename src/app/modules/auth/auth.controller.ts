import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';

import { Gender } from 'src/app/vendors/common/enums';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('gender') gender: Gender,
  ) {
    return this.authService.registerUser(email, password, name, gender);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body('email') email: string, @Body('password') password: string) {
    if (!email) throw new BadRequestException('Email is required.');
    if (!password) throw new BadRequestException('Password is required.');

    return this.authService.login(email, password);
  }
}
