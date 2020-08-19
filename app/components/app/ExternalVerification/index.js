import { connect } from 'react-redux';
import { toggleDock } from 'actions/display';
import { openCard } from 'actions/cards';
import {
  toggleExternalSettingsModal,
  toggleExternalCreateModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  resetExternalState,
  requestGetExternalCard,
  updateExternalTitle,
  updateExternalLinkAnswer
} from 'actions/externalVerification';
import { requestUpdateUser } from 'actions/profile';
import ExternalVerification from './ExternalVerification';

const mapStateToProps = (state) => {
  const {
    profile: { user, isUpdatingUser, updateUserError },
    display: { dockVisible, windowUrl },
    externalVerification: {
      isDisplayed,
      activeIntegration,
      isSettingsModalOpen,
      settingIndex,
      externalCard,
      isGettingCard,
      isCreatingCard
    }
  } = state;

  return {
    user,
    isUpdatingUser,
    updateUserError,
    dockVisible,
    windowUrl,
    isDisplayed,
    activeIntegration,
    isSettingsModalOpen,
    settingIndex,
    externalCard,
    isGettingCard,
    isCreatingCard
  };
};

const mapDispatchToProps = {
  toggleExternalSettingsModal,
  toggleExternalCreateModal,
  toggleExternalDisplay,
  updateExternalSettingIndex,
  updateExternalIntegration,
  resetExternalState,
  requestGetExternalCard,
  updateExternalTitle,
  updateExternalLinkAnswer,
  requestUpdateUser,
  openCard,
  toggleDock
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalVerification);
