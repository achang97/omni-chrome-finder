import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock, minimizeDock, toggleAutofindTab } from 'actions/display';
import { updateAskSearchText, updateAskQuestionTitle } from 'actions/ask';
import { openCard } from 'actions/cards';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { updateCreateAnswerEditor } from 'actions/create';
import { updateNavigateSearchText } from 'actions/navigate';
import { requestGetUser } from 'actions/profile';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from 'actions/tasks';
import { SEARCH } from 'appConstants';
import { hasCompletedOnboarding } from 'utils/auth';
import ChromeMessageListener from './ChromeMessageListener';

const mapStateToProps = (state) => {
  const { 
    display: {
      dockVisible,
      dockExpanded,
      autofindShown,
    },
    auth: {
      token
    },
    profile: {
      user={}
    },
    tasks: {
      tasks
    },
    search: {
      cards: {
        [SEARCH.TYPE.AUTOFIND]: {
          isSearchingCards,
        }
      }
    }
  } = state;

  const { isVerified, autofindPermissions={}, onboarding } = user;

  return {
    dockVisible,
    dockExpanded,
    autofindShown,
    isSearchingCards,
    isLoggedIn: !!token,
    isVerified,
    autofindPermissions,
    hasCompletedOnboarding: hasCompletedOnboarding(onboarding),
    tasks
  };
}

const mapDispatchToProps = {
  toggleDock,
  minimizeDock,
  toggleAutofindTab,
  requestGetUser,
  openCard,
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
