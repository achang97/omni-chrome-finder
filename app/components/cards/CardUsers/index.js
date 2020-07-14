import _ from 'lodash';
import { connect } from 'react-redux';
import { requestSearchUsers } from 'actions/search';
import { ROLE, STATUS } from 'appConstants/user';
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
    { type: STATUS.ACTIVE, isShown: true },
    { type: STATUS.INVITED, isShown: showInviteOptions }
  ];
  const sectionedOptions = sections
    .filter(({ isShown }) => isShown)
    .map(({ type }) => ({
      label: type,
      options: groupedUserOptions[type] || []
    }));

  const isAdmin = role === ROLE.ADMIN;
  return { userOptions: sectionedOptions, isLoading: isSearchingUsers, isAdmin };
};

const mapDispatchToProps = {
  requestSearchUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(CardUsers);
