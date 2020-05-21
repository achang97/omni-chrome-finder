import PropTypes from 'prop-types';
import { PROFILE, FINDER } from 'appConstants';

export const UserPropTypes = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  bio: PropTypes.string,
  email: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  isVerified: PropTypes.bool.isRequired,
  role: PropTypes.oneOf(Object.values(PROFILE.USER_ROLE)).isRequired,
  team: PropTypes.string,
  companyName: PropTypes.string.isRequired,
  company: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  permissionGroups: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
    .isRequired,
  bookmarkIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
