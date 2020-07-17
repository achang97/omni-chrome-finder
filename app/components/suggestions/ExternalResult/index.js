import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import {
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId
} from 'actions/externalVerification';
import { requestLogAudit } from 'actions/auditLog';
import { isEditor } from 'utils/auth';
import trackEvent from 'actions/analytics';
import ExternalResult from './ExternalResult';

const mapStateToProps = (state) => {
  const {
    profile: {
      user: { role }
    }
  } = state;

  return { isEditor: isEditor(role) };
};

const mapDispatchToProps = {
  openCard,
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId,
  requestLogAudit,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalResult);
