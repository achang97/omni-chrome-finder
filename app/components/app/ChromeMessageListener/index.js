import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { toggleDock, minimizeDock, toggleAutofindTab, toggleSearchBar } from 'actions/display';
import { updateAskSearchText, toggleAskTeammate } from 'actions/ask';
import { openCard } from 'actions/cards';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { updateCreateAnswerEditor } from 'actions/create';
import { requestGetUser } from 'actions/profile';
import { requestLogAudit } from 'actions/auditLog';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from 'actions/tasks';
import { isValidUser } from 'utils/auth';
import ChromeMessageListener from './ChromeMessageListener';

const mapStateToProps = (state) => {
  const {
    display: { dockVisible, toggleTabShown, autofindShown, onlyShowSearchBar },
    ask: { showAskTeammate },
    profile: { user = {} },
    tasks: { tasks }
  } = state;

  const searchBarSettings = _.get(user, 'widgetSettings.searchBar', {});
  return {
    dockVisible,
    toggleTabShown,
    onlyShowSearchBar,
    autofindShown,
    isValidUser: isValidUser(user),
    searchBarSettings,
    showAskTeammate,
    tasks
  };
};

const mapDispatchToProps = {
  toggleDock,
  minimizeDock,
  toggleAutofindTab,
  toggleSearchBar,
  requestGetUser,
  openCard,
  updateAskSearchText,
  toggleAskTeammate,
  updateCreateAnswerEditor,
  requestSearchCards,
  clearSearchCards,
  requestGetTasks,
  updateTasksTab,
  updateTasksOpenSection,
  requestLogAudit
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChromeMessageListener));
