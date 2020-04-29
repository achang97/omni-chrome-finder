import { CHROME, NODE_ENV, REQUEST } from 'appConstants';
import { getStorage } from 'utils/storage';
import { createNotification } from './notifications';

let socket;

export function closeSocket() {
  socket.close();
  socket = null;
}

export function initSocket() {
  if (socket) {
    return;
  }

  getStorage(CHROME.STORAGE.AUTH).then((auth) => {
    const token = auth && auth.token;
    if (token && !socket) {
      const protocol = process.env.NODE_ENV === NODE_ENV.DEV ? 'ws://' : 'wss://';
      const wsToken = token.replace('Bearer ', '');
      socket = new WebSocket(`${protocol}${REQUEST.URL.BASE}/ws/generic?auth=${wsToken}`);

      socket.onopen = () => {
        console.log('Connected socket!');
      };

      socket.onclose = () => {
        console.log('Disconnected socket!');
        socket = null;

        // Attempt to reconnect
        getStorage(CHROME.STORAGE.AUTH).then((auth) => {
          const isLoggedIn = auth && auth.token;
          if (isLoggedIn) {
            console.log('Reconnecting socket!');
            initSocket();
          }
        });
      };

      socket.onmessage = (event) => {
        console.log('Received data from socket: ', event);
        getStorage(CHROME.STORAGE.AUTH).then((auth) => {
          const isLoggedIn = auth && auth.token;
          const isVerified = auth && auth.user && auth.user.isVerified;
          if (isLoggedIn && isVerified) {
            const { type, data: payload } = JSON.parse(event.data);
            createNotification(payload);
          }
        });
      };

      socket.onerror = (error) => {
        console.log('Socket error: ', error);
      };
    }
  });
}