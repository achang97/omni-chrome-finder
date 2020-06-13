import { connect } from 'react-redux';
import {
  requestSearchCards,
  clearSearchCards,
  requestSearchNodes,
  requestSearchIntegrations
} from 'actions/search';
import { requestLogAudit } from 'actions/auditLog';
import trackEvent from 'actions/analytics';
import { SEARCH } from 'appConstants';
import SuggestionPanel from './SuggestionPanel';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: { [SEARCH.SOURCE.DOCK]: cards },
      nodes,
      isSearchingNodes,
      integrationResults,
      isSearchingIntegrations
    },
    display: { dockVisible }
  } = state;

  return {
    ...cards,
    nodes,
    isSearchingNodes,
    integrationResults,
    isSearchingIntegrations,
    dockVisible
  };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards,
  requestSearchNodes,
  requestSearchIntegrations,
  requestLogAudit,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionPanel);
