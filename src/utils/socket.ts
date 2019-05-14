import { encrypt } from './encrypt';
import { SocketEvents } from '../constant/socket-event';

let io = null;
export const onDisconnect = (socket) => {
};

export const onConnectFn = (socket) => {
  console.log('User connect');

  socket.on(SocketEvents.JOIN, (data) => {
    if (data) {
      if (!data.userId) {
        return;
      }
      socket.join(data.userId); // using room of socket io
      pushToUser(data.userId, JSON.stringify({title: 'Hello'}));
    } else {
      return;
    }
  });

  socket.on('disconnection', () => {
    onDisconnect(socket);
  });
};

export const init = (ioInput) => {
  if (ioInput) {
    io = ioInput;
    io.set('origins', '*:*');
    io.on('connection', onConnectFn);
  }
};

export const pushToUser = (userId, content) => {
  if (!io) {
    return;
  }

  io.in(userId).emit(SocketEvents.NOTIFY, JSON.stringify(content));
};

export const broadcast = (type, content) => {
  if (!io) {
    return;
  }

  type = type.toString().toUpperCase();
  io.emit(type, encrypt(JSON.stringify(content)));
};
