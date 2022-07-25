import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserLogType, UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.userService.getAll();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  getOne(@Param('userId') userId: number) {
    return this.userService.getOne(userId);
  }

  @Post('add-log')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  addLog(@Req() req, @Body('logType') logType: UserLogType) {
    const userId: number = req.user.userId;
    return this.userService.addLog(userId, logType);
  }
}
