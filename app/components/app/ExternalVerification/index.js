import { connect } from 'react-redux';
import { isValidUser } from 'utils/auth';
import { toggleDock } from 'actions/display';
import { openCard } from 'actions/cards';
import {
  updateExternalVerificationInterval,
  addExternalOwner,
  removeExternalOwner,
  toggleExternalCreateModal,
  toggleExternalSettingsModal,
  toggleExternalFinderModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard
} from 'actions/externalVerification';
import { requestUpdateUser } from 'actions/profile';
import ExternalVerification from './ExternalVerification';

const mapStateToProps = (state) => {
  const {
    profile: { user = {}, isUpdatingUser, updateUserError },
    auth: { token },
    display: { dockVisible },
    externalVerification: {
      isDisplayed,
      activeIntegration,
      isCreateModalOpen,
      isFinderModalOpen,
      isSettingsModalOpen,
      settingIndex,
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
    isUpdatingUser,
    updateUserError,
    dockVisible,
    isDisplayed,
    activeIntegration,
    isCreateModalOpen,
    isFinderModalOpen,
    isSettingsModalOpen,
    settingIndex,
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
  toggleExternalCreateModal,
  toggleExternalSettingsModal,
  toggleExternalFinderModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  updateExternalFinderNode,
  resetExternalState,
  requestCreateExternalCard,
  requestGetExternalCard,
  requestUpdateUser,
  openCard,
  toggleDock
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalVerification);
