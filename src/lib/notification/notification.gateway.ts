
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_notification')
  handleNotification(@MessageBody() data: any, client: Socket) {
    console.log('Received notification data:', data);
    console.log(client);
    this.server.emit('receive_notification', data);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
