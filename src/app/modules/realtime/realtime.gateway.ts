import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageRepository } from 'src/app/repositories/message.repository';
import { MessageSender } from 'src/app/vendors/common/enums';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowUpgrades: true,
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly ROOM_ADMIN = 'ROOM_FOR_ADMIN';

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageService: MessageService,
  ) {}

  afterInit() {
    console.log(`Realtime gateway initialized!`);
  }

  handleConnection(client: Socket) {
    console.log(`Client [${client.id}] connected!`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client [${client.id}] disconnected!`);
  }

  @SubscribeMessage('client_online')
  handleClientOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number },
  ) {
    client.join(`ROOM_FOR_CLIENT_${payload.clientId}`);
  }

  @SubscribeMessage('client_send_message_text')
  async handleClientSendMessageText(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number; text: string },
  ) {
    const ROOM_CLIENT = `ROOM_FOR_CLIENT_${payload.clientId}`;

    const message = await this.messageRepository.save(
      this.messageRepository.create({
        userId: payload.clientId,
        sender: MessageSender.CLIENT,
        text: payload.text,
      }),
    );

    this.server.in(ROOM_CLIENT).emit('new_message', message);

    const convData = await this.messageService.getConversation(
      payload.clientId,
    );

    console.log(convData);

    this.server
      .in(this.ROOM_ADMIN)
      .emit('has_new_message_from_client', convData);
  }

  @SubscribeMessage('admin_online')
  handleAdminOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { adminId: number },
  ) {
    client.join(`ROOM_FOR_ADMIN`);
  }

  @SubscribeMessage('admin_join_client_room')
  handleAdminJoinClientRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number },
  ) {
    client.join(`ROOM_FOR_CLIENT_${payload.clientId}`);
  }

  @SubscribeMessage('admin_leave_client_room')
  handleAdminLeaveClientRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number },
  ) {
    client.leave(`ROOM_FOR_CLIENT_${payload.clientId}`);
  }

  @SubscribeMessage('admin_send_message_text')
  async handleAdminSendMessageText(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number; text: string },
  ) {
    const ROOM_CLIENT = `ROOM_FOR_CLIENT_${payload.clientId}`;

    const message = await this.messageRepository.save(
      this.messageRepository.create({
        userId: payload.clientId,
        sender: MessageSender.ADMIN,
        text: payload.text,
      }),
    );

    this.server.in(ROOM_CLIENT).emit('new_message', message);
  }

  @SubscribeMessage('admin_seen')
  async handleAdminSeenConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { clientId: number },
  ) {
    await this.messageRepository
      .createQueryBuilder()
      .update()
      .set({
        seen: 1,
      })
      .where('user_id = :userId', { userId: payload.clientId })
      .andWhere('sender = :sender', { sender: MessageSender.CLIENT })
      .execute();

    this.server
      .in(this.ROOM_ADMIN)
      .emit('admin_seen_message_for_client', payload);
  }
}
