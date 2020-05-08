import { CHROME, NODE_ENV, REQUEST } from 'appConstants';
import { getStorage, addStorageListener } from 'utils/storage';
import createNotification from './notifications';

let socket;

function closeSocket() {
  socket.close();
  socket = null;
}

function handleSocketMessage(type, payload) {
  switch (type) {
    case CHROME.SOCKET_MESSAGE_TYPE.OAUTH_SUCCESS: {
      // TODO: Only send to one tab with injected extension. Currently, send to all tabs
      // (since the focused tab is not necessarily the one with injected extension).
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, { type, payload }));
      });
      break;
    }
    case CHROME.SOCKET_MESSAGE_TYPE.NOTIFICATION: {
      createNotification(payload);
      break;
    }
    default: {
      break;
    }
  }
}

addStorageListener(CHROME.STORAGE.AUTH, ({ newValue }) => {
  if (!newValue.token) {
    closeSocket();
  } else if (newValue.token) {
    initSocket();
  }
});

function setSocketListeners() {
  socket.onopen = () => {};

  socket.onclose = () => {
    socket = null;

    // Attempt to reconnect
    initSocket();
  };

  socket.onmessage = (event) => {
    getStorage(CHROME.STORAGE.AUTH).then((auth) => {
      const isLoggedIn = auth && auth.token;
      const isVerified = auth && auth.user && auth.user.isVerified;
      if (isLoggedIn && isVerified) {
        const { type, data: payload } = JSON.parse(event.data);
        handleSocketMessage(type, payload);
      }
    });
  };

  socket.onerror = () => {};
}

export default function initSocket() {
  if (socket) {
    return;
  }

  getStorage(CHROME.STORAGE.AUTH).then((auth) => {
    const token = auth && auth.token;
    if (token && !socket) {
      const protocol = process.env.NODE_ENV === NODE_ENV.DEV ? 'ws://' : 'wss://';
      const wsToken = token.replace('Bearer ', '');
      socket = new WebSocket(`${protocol}${REQUEST.URL.BASE}/ws/generic?auth=${wsToken}`);
      setSocketListeners();
    }
  });
}
