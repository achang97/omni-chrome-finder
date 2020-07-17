import _ from 'lodash';
import { connect } from 'react-redux';
import { requestSearchUsers } from 'actions/search';
import { STATUS } from 'appConstants/user';
import { isEditor } from 'utils/auth';
import CardUsers from './CardUsers';

const mapStateToProps = (state, ownProps) => {
  const {
    search: { users: userOptions, isSearchingUsers },
    profile: { user }
  } = state;

  // Do some processing of users with the passed in component props
  const {
    showInviteOptions = true,
    disabledUserIds = [],
    disabledUserRoles = [],
    users = []
  } = ownProps;

  const filteredOptions = userOptions.filter(
    ({ _id, role }) =>
      !disabledUserIds.includes(_id) &&
      !disabledUserRoles.includes(role) &&
      !users.some((currUser) => currUser._id === _id)
  );
  const groupedUserOptions = _.groupBy(filteredOptions, 'status');

  const sections = [
    { type: STATUS.ACTIVE, isShown: true },
    { type: STATUS.INVITED, isShown: showInviteOptions }
  ];
  const sectionedOptions = sections
    .filter(({ isShown }) => isShown)
    .map(({ type }) => ({
      label: type,
      options: groupedUserOptions[type] || []
    }));

  return {
    userOptions: sectionedOptions,
    isLoading: isSearchingUsers,
    isEditor: isEditor(user.role)
  };
};

const mapDispatchToProps = {
  requestSearchUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(CardUsers);
