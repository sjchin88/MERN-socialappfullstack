import { Server, Socket } from 'socket.io';
import { ISocketData } from '@user/interfaces/user.interface';

// Use this to emit the event inside the controller outside the socketioposthandler class
export let socketIOUserObject: Server;

/**
 * Use socket IO post handler so user can get faster response when they post any thing
 */
export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      //listen for new reaction
      socket.on('block user', (data: ISocketData) => {
        //listen for all users response
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        //listen for all users response
        this.io.emit('unblocked user id', data);
      });
    });
  }
}
