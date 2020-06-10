import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import ExternalResult from './ExternalResult';

const mapDispatchToProps = {
  openCard
};

export default connect(null, mapDispatchToProps)(ExternalResult);
