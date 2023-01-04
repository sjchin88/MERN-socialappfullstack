import { Server, Socket } from 'socket.io';

// Use this to emit the event inside the controller outside the socketioposthandler class
export let socketIOPostObject: Server;

/**
 * Use socket IO post handler so user can get faster response when they post any thing
 */
export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      //TODO change later
      console.log('Post socketio handler');
    });
  }
}
