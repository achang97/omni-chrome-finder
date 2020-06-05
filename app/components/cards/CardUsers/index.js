import { connect } from 'react-redux';
import { requestSearchUsers, requestSearchInvitedUsers } from 'actions/search';
import { USER_ROLE } from 'appConstants/profile';
import { formatInvitedUser } from 'utils/card';
import CardUsers from './CardUsers';

const mapStateToProps = (state, ownProps) => {
  const {
    search: { users, isSearchingUsers, invitedUsers, isSearchingInvites },
    profile: {
      user: { role }
    }
  } = state;

  const { showInviteOptions } = ownProps;

  let userOptions = users;
  if (showInviteOptions) {
    userOptions = userOptions.concat(invitedUsers.map(formatInvitedUser));
  }

  const isAdmin = role === USER_ROLE.ADMIN;
  return { userOptions, isLoading: isSearchingUsers || isSearchingInvites, isAdmin };
};

const mapDispatchToProps = {
  requestSearchUsers,
  requestSearchInvitedUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(CardUsers);
