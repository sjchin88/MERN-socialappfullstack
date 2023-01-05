import { ICommentDocument } from '@comment/interfaces/comment.interface';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
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
      //listen for new reaction
      socket.on('reaction', (reaction: IReactionDocument) => {
        //listen for all users response
        this.io.emit('update like', reaction);
      });

      //Listen for new comment
      socket.on('comment', (data: ICommentDocument) => {
        //listen for all users response
        this.io.emit('update comment', data);
      });
    });
  }
}
