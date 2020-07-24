import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { requestSearchCards, clearSearchCards, requestSearchIntegrations } from 'actions/search';
import { openCard } from 'actions/cards';
import { requestUpdateUser } from 'actions/profile';
import trackEvent from 'actions/analytics';
import { requestLogAudit } from 'actions/auditLog';
import { SEARCH } from 'appConstants';
import SuggestionPanel from './SuggestionPanel';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: { [SEARCH.SOURCE.DOCK]: cards },
      nodes,
      integrations,
      isSearchingIntegrations,
      hasSearchedIntegrations
    },
    display: { dockVisible },
    profile: { user }
  } = state;

  return {
    ...cards,
    nodes,
    integrations,
    isSearchingIntegrations,
    hasSearchedIntegrations,
    dockVisible,
    user
  };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards,
  requestSearchIntegrations,
  openCard,
  requestUpdateUser,
  trackEvent,
  requestLogAudit
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SuggestionPanel));
