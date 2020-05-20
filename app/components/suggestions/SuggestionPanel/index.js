import { connect } from 'react-redux';
import { requestSearchCards, clearSearchCards, requestSearchNodes } from 'actions/search';
import { requestLogAudit } from 'actions/auditLog';
import trackEvent from 'actions/analytics';
import { SEARCH } from 'appConstants';
import SuggestionPanel from './SuggestionPanel';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: { [SEARCH.TYPE.POPOUT]: cards },
      nodes,
      isSearchingNodes
    }
  } = state;

  return { ...cards, nodes, isSearchingNodes };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards,
  requestSearchNodes,
  requestLogAudit,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionPanel);
