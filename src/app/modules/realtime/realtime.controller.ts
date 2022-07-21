import { Controller, Get, UseGuards } from '@nestjs/common';

import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { UserRole } from 'src/app/vendors/common/enums';

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly messageService: MessageService) {}

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  getAllConversations() {
    return this.messageService.getAllConversations();
  }

  @Get('conversation/:userId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  getMessages() {
    return this.messageService.getMessages();
  }
}
