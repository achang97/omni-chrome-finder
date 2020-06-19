import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import {
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId
} from 'actions/externalVerification';
import { requestLogAudit } from 'actions/auditLog';
import trackEvent from 'actions/analytics';
import ExternalResult from './ExternalResult';

const mapDispatchToProps = {
  openCard,
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId,
  requestLogAudit,
  trackEvent
};

export default connect(null, mapDispatchToProps)(ExternalResult);
