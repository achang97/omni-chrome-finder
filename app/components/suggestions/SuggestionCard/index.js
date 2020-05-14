import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import trackEvent from 'actions/analytics';
import SuggestionCard from './SuggestionCard';

const mapDispatchToProps = {
  openCard,
  trackEvent
};

export default connect(undefined, mapDispatchToProps)(SuggestionCard);
