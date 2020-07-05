import _ from 'lodash';
import { connect } from 'react-redux';
import { requestSearchUsers } from 'actions/search';
import { USER_ROLE, USER_STATUS } from 'appConstants/profile';
import CardUsers from './CardUsers';

const mapStateToProps = (state, ownProps) => {
  const {
    search: { users, isSearchingUsers },
    profile: {
      user: { role }
    }
  } = state;

  const { showInviteOptions = true, disabledUserIds = [] } = ownProps;

  const userOptions = users.filter(({ _id }) => !disabledUserIds.includes(_id));
  const groupedUserOptions = _.groupBy(userOptions, 'status');

  const sections = [
    { type: USER_STATUS.ACTIVE, isShown: true },
    { type: USER_STATUS.INVITED, isShown: showInviteOptions }
  ];
  const sectionedOptions = sections
    .filter(({ isShown }) => isShown)
    .map(({ type }) => ({
      label: type,
      options: groupedUserOptions[type] || []
    }));

  const isAdmin = role === USER_ROLE.ADMIN;
  return { userOptions: sectionedOptions, isLoading: isSearchingUsers, isAdmin };
};

const mapDispatchToProps = {
  requestSearchUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(CardUsers);
