import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock, minimizeDock, toggleAutofindTab } from 'actions/display';
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
    display: { dockVisible, autofindShown },
    ask: { showAskTeammate },
    auth: { token },
    profile: { user = {} },
    tasks: { tasks }
  } = state;

  return {
    dockVisible,
    autofindShown,
    isValidUser: isValidUser(token, user),
    showAskTeammate,
    tasks
  };
};

const mapDispatchToProps = {
  toggleDock,
  minimizeDock,
  toggleAutofindTab,
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
