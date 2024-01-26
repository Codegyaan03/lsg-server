import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  socket: Socket;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: any) {
    this.socket.emit('message', payload);
  }

  @SubscribeMessage('newLog')
  handleLog(@MessageBody() payload: any) {
    this.socket.emit('newLog', payload);
  }

  emitMessage(event: string, message: string | Record<string, any>) {
    this.socket.emit(event, message);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
