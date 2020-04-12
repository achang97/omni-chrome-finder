import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import SuggestionPreview from './SuggestionPreview';

const mapDispatchToProps = {
  openCard
};

export default connect(undefined, mapDispatchToProps)(SuggestionPreview);
