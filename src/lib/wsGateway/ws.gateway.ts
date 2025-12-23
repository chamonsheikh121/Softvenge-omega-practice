import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { subscribe } from 'diagnostics_channel';
import { Server, Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';

interface MessagePayload {
  senderId: string;
  recipientId?: string; // for 1-1
  groupId?: string; // for group
  message: string;
  chatId?: string; // optional chatId for private chat
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly onlineUsers = new Map<number, Set<string>>();
  private readonly socketToUser = new Map<string, number>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, userId: number) {
    client.join(`joinChat_${userId}`);

    this.socketToUser.set(client.id, userId);
    if (!this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, new Set());
    }
    this.onlineUsers.get(userId)?.add(client.id);

    this.server.emit('userOnline', { userId });
    console.log(`User ${userId} joined chat with socket ${client.id}`);

    const onlineUsers = Array.from(this.onlineUsers.keys());

    client.emit('onlineUsers', onlineUsers);

    return { success: true, message: `Joined chat as user ${userId}` };
  }


  @SubscribeMessage('sendMessage')
 async handleMessage(
   @ConnectedSocket() client:Socket,
    @MessageBody() payload:{senderId:string, recipientId:string,message:string}
  ){

    try {
      
      // const messsage = await 

    } catch (error) {
      
    }

  }
  


}
