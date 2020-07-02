import { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { CHROME, ROUTES, URL, TASKS, PROFILE } from 'appConstants';
import { getNewCardBaseState } from 'utils/card';
import { UserPropTypes } from 'utils/propTypes';
import { convertTextToModel } from 'utils/editor';
import { isValidUser } from 'utils/auth';

class ChromeMessageListener extends Component {
  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    this.openChromeExtension();
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
  }

  isValidUser = () => {
    const { user } = this.props;
    return isValidUser(user);
  };

  hasUrlChanged = () => {
    const { toggleAutofindTab, autofindShown, windowUrl, updateWindowUrl } = this.props;

    const hasChanged = windowUrl !== window.location.href;
    if (hasChanged) {
      updateWindowUrl(window.location.href);
      if (!autofindShown) toggleAutofindTab();
    }

    return hasChanged;
  };

  openDock = () => {
    const { toggleDock, dockVisible } = this.props;
    if (!dockVisible) {
      toggleDock();
    }
  };

  openChromeExtension = () => {
    const { openCard } = this.props;

    if (this.hasUrlChanged()) {
      const url = window.location.href;

      if (url.startsWith(URL.EXTENSION)) {
        this.openDock();

        if (this.isValidUser()) {
          const { taskId, cardId, edit } = queryString.parse(window.location.search);
          if (taskId) {
            this.openTask(taskId);
          }

          if (cardId) {
            openCard({ _id: cardId, isEditing: edit === 'true' });
          }
        }
      }
    }
  };

  openTask = (taskId) => {
    const { tasks, updateTasksTab, updateTasksOpenSection, history } = this.props;
    history.push(ROUTES.TASKS);

    if (taskId) {
      const task = tasks.find(({ _id }) => _id === taskId);
      if (task) {
        if (task.status === TASKS.TYPE.NEEDS_APPROVAL) {
          // Go to Needs Approval Tab
          updateTasksTab(1);
        } else {
          updateTasksTab(0);
          const taskSectionType = TASKS.SECTIONS.find(
            ({ taskTypes }) => taskTypes.length === 1 && taskTypes[0] === task.status
          );
          updateTasksOpenSection(taskSectionType ? taskSectionType.type : TASKS.SECTION_TYPE.ALL);
        }
      }
    }
  };

  handleContextMenuAction = (action, selectedText) => {
    const {
      showAskTeammate,
      history,
      updateAskSearchText,
      toggleAskTeammate,
      openCard,
      requestLogAudit,
      user
    } = this.props;

    this.openDock();

    if (this.isValidUser()) {
      switch (action) {
        case CHROME.MESSAGE.SEARCH: {
          if (showAskTeammate) {
            toggleAskTeammate();
          }
          updateAskSearchText(selectedText);
          requestLogAudit(PROFILE.AUDIT.TYPE.CONTEXT_MENU_SEARCH, { query: selectedText });
          history.push(ROUTES.ASK);
          break;
        }
        case CHROME.MESSAGE.CREATE: {
          const newCardState = {
            ...getNewCardBaseState(user),
            edits: { answerModel: convertTextToModel(selectedText) }
          };
          openCard(newCardState, true);
          break;
        }
        default:
          break;
      }
    }
  };

  handleNotificationOpened = ({ type, id }) => {
    const { openCard, requestGetTasks } = this.props;

    this.openDock();

    if (this.isValidUser()) {
      const {
        location: { pathname }
      } = this.props;

      switch (type) {
        case CHROME.NOTIFICATION_TYPE.TASK: {
          if (pathname === ROUTES.TASKS) {
            requestGetTasks();
          }
          this.openTask(id);
          break;
        }
        case CHROME.NOTIFICATION_TYPE.CARD: {
          openCard({ _id: id });
          break;
        }
        default:
          break;
      }
    }
  };

  handleSocketMessage = (type) => {
    const { requestGetUser } = this.props;

    switch (type) {
      case CHROME.SOCKET_MESSAGE_TYPE.OAUTH_SUCCESS: {
        requestGetUser();
        break;
      }
      default:
        break;
    }
  };

  handleCommand = (command) => {
    const { dockVisible, toggleDock, minimizeDock } = this.props;

    switch (command) {
      case CHROME.COMMAND.OPEN_EXTENSION: {
        if (dockVisible) {
          minimizeDock();
        } else {
          toggleDock();
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  listener = (msg) => {
    const { toggleDock } = this.props;
    const { type, payload } = msg;
    switch (type) {
      // Messages
      case CHROME.MESSAGE.TOGGLE: {
        toggleDock();
        break;
      }
      case CHROME.MESSAGE.TAB_UPDATE: {
        this.openChromeExtension();
        break;
      }
      case CHROME.MESSAGE.SEARCH:
      case CHROME.MESSAGE.CREATE: {
        this.handleContextMenuAction(type, payload.selectionText);
        break;
      }
      case CHROME.MESSAGE.NOTIFICATION_OPENED: {
        this.handleNotificationOpened(payload);
        break;
      }

      // Socket messages
      case CHROME.SOCKET_MESSAGE_TYPE.OAUTH_SUCCESS: {
        this.handleSocketMessage(type, payload);
        break;
      }

      // Shortcuts
      case CHROME.COMMAND.OPEN_EXTENSION: {
        this.handleCommand(type);
        break;
      }

      default:
        break;
    }
  };

  render() {
    return null;
  }
}

ChromeMessageListener.propTypes = {
  // Redux State
  dockVisible: PropTypes.bool.isRequired,
  windowUrl: PropTypes.string,
  showAskTeammate: PropTypes.bool.isRequired,
  autofindShown: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: UserPropTypes,

  // Redux Actions
  toggleDock: PropTypes.func.isRequired,
  minimizeDock: PropTypes.func.isRequired,
  toggleAutofindTab: PropTypes.func.isRequired,
  updateWindowUrl: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  updateAskSearchText: PropTypes.func.isRequired,
  toggleAskTeammate: PropTypes.func.isRequired,
  requestGetTasks: PropTypes.func.isRequired,
  updateTasksTab: PropTypes.func.isRequired,
  updateTasksOpenSection: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired
};

export default ChromeMessageListener;
