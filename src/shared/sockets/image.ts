import { Server } from 'socket.io';

// Use this to emit the event inside the controller outside the socketioposthandler class
let socketIOImageObject: Server;

/**
 * Use socket IO post handler so user can get faster response when they post any thing
 */
export class SocketIOImageHandler {
  public listen(io: Server): void {
    socketIOImageObject = io;
  }
}

export { socketIOImageObject };
