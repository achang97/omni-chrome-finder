import { connect } from 'react-redux';
import { isValidUser } from 'utils/auth';
import { toggleDock } from 'actions/display';
import { openCard } from 'actions/cards';
import {
  updateExternalVerificationInterval,
  addExternalOwner,
  removeExternalOwner,
  toggleExternalModal,
  toggleExternalDisplay,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard
} from 'actions/externalVerification';
import ExternalVerification from './ExternalVerification';

const mapStateToProps = (state) => {
  const {
    profile: { user = {} },
    auth: { token },
    display: { dockVisible },
    externalVerification: {
      isDisplayed,
      activeIntegration,
      isModalOpen,
      owners,
      verificationInterval,
      finderNode,
      externalCard,
      isGettingCard,
      isCreatingCard,
      createCardError
    }
  } = state;

  return {
    isValidUser: isValidUser(token, user),
    user,
    dockVisible,
    isDisplayed,
    activeIntegration,
    isModalOpen,
    owners,
    verificationInterval,
    finderNode,
    externalCard,
    isGettingCard,
    isCreatingCard,
    createCardError
  };
};

const mapDispatchToProps = {
  updateExternalVerificationInterval,
  addExternalOwner,
  removeExternalOwner,
  toggleExternalModal,
  toggleExternalDisplay,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard,
  openCard,
  toggleDock
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalVerification);
