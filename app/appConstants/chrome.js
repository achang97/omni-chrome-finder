export const MESSAGE = {
  TOGGLE: 'TOGGLE',
  TAB_UPDATE: 'TAB_UPDATE',
  SEARCH: 'SEARCH',
  ASK: 'ASK',
  CREATE: 'CREATE',
  NOTIFICATION_OPENED: 'NOTIFICATION_OPENED',
};

export const COMMAND = {
  OPEN_EXTENSION: 'OPEN_EXTENSION'
}

export const SOCKET_MESSAGE_TYPE = {
  OAUTH_SUCCESS: 'oauthSuccess',
  NOTIFICATION: 'notification',
}

export const NOTIFICATION_TYPE = {
  CARD: 'CARD',
  TASK: 'TASK',
}

export const STORAGE = {
  AUTH: 'auth',
  TASKS: 'tasks',
}

export default { MESSAGE, STORAGE, NOTIFICATION_TYPE, COMMAND, SOCKET_MESSAGE_TYPE };