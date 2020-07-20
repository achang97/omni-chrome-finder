import { STATUS } from 'appConstants/user';

export function isInvitedUser(user) {
  return user.status === STATUS.INVITED;
}

export function isActiveUser(user) {
  return user.status === STATUS.ACTIVE;
}

export default { isInvitedUser, isActiveUser };
