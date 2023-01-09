import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';

// Use this to emit the event inside the controller outside the socketioposthandler class
export let socketIOChatObject: Server;

/**
 * Use socket IO post handler so user can get faster response when they post any thing
 */
export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      //listen for new reaction
      socket.on('join room', (data: ISenderReceiver) => {
        console.log();
      });
    });
  }
}
