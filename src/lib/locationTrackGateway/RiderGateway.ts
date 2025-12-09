import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  namespace: 'rider',
  cors: { origin: '*' },
})
export class RiderGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private interval: NodeJS.Timer;
  private lat = 23.8; // starting position
  private lng = 90.4; // starting position
  private step = 0.01; // movement per second

  afterInit() {
    console.log('RiderGateway initialized');

    this.interval = setInterval(() => {
      this.lng += this.step; // move east/right

      // Optional: loop back if too far
      if (this.lng > 90.8) {
        this.lng = 90.4;
      }

      this.server.emit('location-update', { lat: this.lat, lng: this.lng });
    }, 1000);
  }

  handleConnection(client: Socket) {
    console.log(`Rider client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Rider client disconnected: ${client.id}`);
  }
}
