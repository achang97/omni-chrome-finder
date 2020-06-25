import PropTypes from 'prop-types';
import { PROFILE, FINDER } from 'appConstants';

export const UserPropTypes = PropTypes.shape({
  _id: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  bio: PropTypes.string,
  email: PropTypes.string,
  profilePicture: PropTypes.string,
  isVerified: PropTypes.bool,
  role: PropTypes.oneOf(Object.values(PROFILE.USER_ROLE)),
  team: PropTypes.string,
  company: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  permissionGroups: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
  bookmarkIds: PropTypes.arrayOf(PropTypes.string),
  notificationPermissions: PropTypes.object,
  autofindPermissions: PropTypes.object,
  onboarding: PropTypes.object
});

export const NodePropTypes = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  finderType: PropTypes.oneOf(Object.values(FINDER.FINDER_TYPE))
});

export default {
  UserPropTypes,
  NodePropTypes
};
