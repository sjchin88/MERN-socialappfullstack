import { Server, Socket } from 'socket.io';
import { ILogin, ISocketData } from '@user/interfaces/user.interface';

// Use this to emit the event inside the controller outside the socketioposthandler class
export let socketIOUserObject: Server;
export const connectedUsersMap: Map<string, string> = new Map();

let users: string[] = [];

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
      //listen for set up
      socket.on('setup', (data: ILogin) => {
        //listen for all users response
        this.addClientToMap(data.username, socket.id);
        this.addUser(data.username);
        this.io.emit('user online', users);
      });

      //listen for new reaction
      socket.on('block user', (data: ISocketData) => {
        //listen for all users response
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        //listen for all users response
        this.io.emit('unblocked user id', data);
      });

      socket.on('disconnect', () => {
        this.removeClientFromMap(socket.id);
      });
    });
  }

  //userId can be actual user name, consider come back later
  private addClientToMap(username: string, socketId: string): void {
    if (!connectedUsersMap.has(username)) {
      connectedUsersMap.set(username, socketId);
    }
  }

  private removeClientFromMap(socketId: string): void {
    if (Array.from(connectedUsersMap.values()).includes(socketId)) {
      const disconnectedUser: [string, string] = [...connectedUsersMap].find((user: [string, string]) => {
        return user[1] === socketId;
      }) as [string, string];
      connectedUsersMap.delete(disconnectedUser[0]);
      this.removeUser(disconnectedUser[0]);
      // send event to the client
      this.io.emit('user online', users);
    }
  }

  //TODO: consider build the set list first
  private addUser(username: string): void {
    users.push(username);
    users = [...new Set(users)];
  }

  private removeUser(username: string): void {
    users = users.filter((name: string) => name != username);
  }
}
