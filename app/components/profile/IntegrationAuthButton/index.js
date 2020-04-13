import { connect } from 'react-redux';
import { requestLogoutUserIntegration } from 'actions/profile';
import IntegrationAuthButton from './IntegrationAuthButton';

const mapStateToProps = (state, ownProps) => {
  const { integration } = ownProps;
  const {
    auth: { token },
    profile: { user, integrationState },
  } = state;

  return {
    user,
    token,
    isLoading: integrationState[integration].isLoading,
    error: integrationState[integration].error,
  };
}

const mapDispatchToProps = {
  requestLogoutUserIntegration,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationAuthButton);