import { Server, Socket } from 'socket.io';
import { IFollowers } from '@follower/interfaces/follower.interface';

// Use this to emit the event inside the controller outside the socketioposthandler class
export let socketIOFollowerObject: Server;

/**
 * Use socket IO post handler so user can get faster response when they post any thing
 */
export class SocketIOFollowerHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOFollowerObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      //listen for new reaction
      socket.on('unfollow user', (data: IFollowers) => {
        //listen for all users response
        this.io.emit('remove follower', data);
      });
    });
  }
}
