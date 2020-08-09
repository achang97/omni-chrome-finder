import { STATUS } from 'appConstants/user';

export function isInvitedUser(user) {
  return user.status === STATUS.INVITED;
}

export function isActiveUser(user) {
  return user.status === STATUS.ACTIVE;
}

export function getUserName(user) {
  if (isInvitedUser(user)) {
    return user.email;
  }

  return `${user.firstname} ${user.lastname}`;
}

export default { isInvitedUser, isActiveUser, getUserName };
