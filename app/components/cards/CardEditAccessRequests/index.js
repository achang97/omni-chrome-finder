import { connect } from 'react-redux';
import { requestApproveEditAccess, requestRejectEditAccess } from 'actions/cards';
import CardEditAccessRequests from './CardEditAccessRequests';

const mapDispatchToProps = {
  requestApproveEditAccess,
  requestRejectEditAccess
};

export default connect(null, mapDispatchToProps)(CardEditAccessRequests);
