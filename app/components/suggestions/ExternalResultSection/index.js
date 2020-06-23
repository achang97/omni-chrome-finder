import { connect } from 'react-redux';
import { requestUpdateUser } from 'actions/profile';
import ExternalResultSection, { SWITCH_PROPS } from './ExternalResultSection';

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

export { SWITCH_PROPS };
export default connect(mapStateToProps, mapDispatchToProps)(ExternalResultSection);
