import { connect } from 'react-redux';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { requestLogAudit } from 'actions/auditLog';
import { SEARCH } from 'appConstants';
import SuggestionPanel from './SuggestionPanel';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: { [SEARCH.TYPE.POPOUT]: cards }
    }
  } = state;

  return { ...cards };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards,
  requestLogAudit
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionPanel);
