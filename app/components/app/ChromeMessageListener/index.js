import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock, minimizeDock, toggleAutofindTab, updateWindowUrl } from 'actions/display';
import { updateAskSearchText, toggleAskTeammate } from 'actions/ask';
import { openCard } from 'actions/cards';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { requestGetUser } from 'actions/profile';
import { requestLogAudit } from 'actions/auditLog';
import { openFinder, pushFinderNode } from 'actions/finder';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from 'actions/tasks';
import ChromeMessageListener from './ChromeMessageListener';

const mapStateToProps = (state) => {
  const {
    display: { dockVisible, autofindShown, windowUrl },
    ask: { showAskTeammate },
    profile: { user = {} },
    tasks: { tasks }
  } = state;

  return {
    dockVisible,
    windowUrl,
    autofindShown,
    user,
    showAskTeammate,
    tasks
  };
};

const mapDispatchToProps = {
  toggleDock,
  minimizeDock,
  toggleAutofindTab,
  updateWindowUrl,
  requestGetUser,
  openCard,
  updateAskSearchText,
  toggleAskTeammate,
  requestSearchCards,
  clearSearchCards,
  requestGetTasks,
  updateTasksTab,
  updateTasksOpenSection,
  requestLogAudit,
  openFinder,
  pushFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChromeMessageListener));
