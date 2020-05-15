import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import trackEvent from 'actions/analytics';
import SuggestionPreview from './SuggestionPreview';

const mapDispatchToProps = {
  openCard,
  trackEvent
};

export default connect(undefined, mapDispatchToProps)(SuggestionPreview);
