import { connect } from 'react-redux';
import { requestUpdateUser } from 'actions/profile';
import ExternalResultSection from './ExternalResultSection';

const mapStateToProps = (state) => {
  const {
    profile: {
      user: {
        widgetSettings: { integrationSearch }
      }
    }
  } = state;

  return { integrationSettings: integrationSearch };
};

const mapDispatchToProps = {
  requestUpdateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalResultSection);
