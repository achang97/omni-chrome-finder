import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import {
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId
} from 'actions/externalVerification';
import ExternalResult from './ExternalResult';

const mapStateToProps = (state) => {
  const {
    profile: { user }
  } = state;

  return { user };
};

const mapDispatchToProps = {
  openCard,
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalResult);
