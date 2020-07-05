import { USER_STATUS } from 'appConstants/profile';

export function isInvitedUser(user) {
  return user.status === USER_STATUS.INVITED;
}

export function isActiveUser(user) {
  return user.status === USER_STATUS.ACTIVE;
}

export default { isInvitedUser, isActiveUser };
