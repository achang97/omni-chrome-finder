import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import SuggestionCard from './SuggestionCard';

const mapDispatchToProps = {
  openCard
};

export default connect(undefined, mapDispatchToProps)(SuggestionCard);