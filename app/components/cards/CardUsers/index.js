import { connect } from 'react-redux';
import { requestSearchUsers } from 'actions/search';
import CardUsers from './CardUsers';

const mapStateToProps = state => {
  const {
    search: {
      users,
      isSearchingUsers
    }
  } = state;

  return { userOptions: users, isSearchingUsers };
}

const mapDispatchToProps = {
  requestSearchUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(CardUsers);
