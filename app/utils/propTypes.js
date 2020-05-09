import PropTypes from 'prop-types';
import { USER_ROLE } from 'appConstants/profile';

export const User = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  bio: PropTypes.string,
  email: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  isVerified: PropTypes.bool.isRequired,
  role: PropTypes.oneOf(Object.values(USER_ROLE)).isRequired,
  team: PropTypes.string,
  companyName: PropTypes.string.isRequired,
});
