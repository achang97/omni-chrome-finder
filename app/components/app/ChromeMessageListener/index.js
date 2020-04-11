import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock } from 'actions/display';
import { updateAskSearchText, updateAskQuestionTitle } from 'actions/ask';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { updateCreateAnswerEditor } from 'actions/create';
import { updateNavigateSearchText } from 'actions/navigate';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from 'actions/tasks';
import { SEARCH } from 'appConstants';
import ChromeMessageListener from './ChromeMessageListener';

console.log(SEARCH.TYPE.AI_SUGGEST)

const mapStateToProps = (state) => {
  const { 
    display: {
      dockVisible,
      dockExpanded
    },
    auth: {
      token
    },
    profile: {
      user
    },
    tasks: {
      tasks
    },
    search: {
      cards: {
        [SEARCH.TYPE.AI_SUGGEST]: {
          isSearchingCards,
        }
      }
    }
  } = state;

  return {
    dockVisible,
    dockExpanded,
    isSearchingCards,
    isLoggedIn: !!token,
    isVerified: user && user.isVerified,
    autofindPermissions: user ? user.autofindPermissions : {},
    tasks
  };
}

const mapDispatchToProps = {
  toggleDock,
  updateAskSearchText,
  updateAskQuestionTitle,
  updateCreateAnswerEditor,
  updateNavigateSearchText,
  requestSearchCards,
  clearSearchCards,
  requestGetTasks,
  updateTasksTab,
  updateTasksOpenSection,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChromeMessageListener));
