import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/app/vendors/common/enums';
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
}
