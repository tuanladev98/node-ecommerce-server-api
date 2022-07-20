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

  afterInit() {
    console.log(`Realtime gateway initialized!`);
  }

  handleConnection(client: Socket) {
    console.log(`Client [${client.id}] connected!`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client [${client.id}] disconnected!`);
  }

  @SubscribeMessage('test')
  test(@ConnectedSocket() client: Socket, @MessageBody() text: string) {
    console.log(
      `Received "test" event from [${client.id}], message: "${text}"`,
    );
  }
}
