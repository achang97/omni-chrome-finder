import { connect } from 'react-redux';
import {
  requestCreateExternalCard,
  toggleExternalCreateModal,
  updateExternalTitle,
  addExternalOwner,
  removeExternalOwner,
  updateExternalVerificationInterval,
  updateExternalFinderNode
} from 'actions/externalVerification';
import ExternalCreateModal from './ExternalCreateModal';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    externalVerification: {
      isCreateModalOpen,
      title,
      owners,
      verificationInterval,
      finderNode,
      isCreatingCard,
      createCardError
    }
  } = state;

  return {
    user,
    isCreateModalOpen,
    title,
    owners,
    verificationInterval,
    finderNode,
    isCreatingCard,
    createCardError
  };
};

const mapDispatchToProps = {
  requestCreateExternalCard,
  toggleExternalCreateModal,
  updateExternalTitle,
  addExternalOwner,
  removeExternalOwner,
  updateExternalVerificationInterval,
  updateExternalFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalCreateModal);
