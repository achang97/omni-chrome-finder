import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { EditorState, ContentState } from 'draft-js';

import { CHROME, ROUTES, URL, TASKS, PROFILE } from 'appConstants';

import SEARCH_BAR_REGEXES from './regex';

import ExternalVerification from '../ExternalVerification';

class ChromeMessageListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prevUrl: null
    };
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    this.openChromeExtension();
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
  }

  hasUrlChanged = () => {
    const { prevUrl } = this.state;
    const { toggleAutofindTab, autofindShown } = this.props;

    const hasChanged = prevUrl !== window.location.href;
    if (hasChanged) {
      this.setState({ prevUrl: window.location.href });
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
    const {
      openCard,
      onlyShowSearchBar,
      toggleTabShown,
      dockVisible,
      isValidUser,
      searchBarSettings,
      toggleSearchBar
    } = this.props;

    if (this.hasUrlChanged()) {
      const url = window.location.href;

      if (url.startsWith(URL.EXTENSION)) {
        this.openDock();

        if (isValidUser) {
          const { taskId, cardId, edit } = queryString.parse(window.location.search);
          if (taskId) {
            this.openTask(taskId);
          }

          if (cardId) {
            openCard({ _id: cardId, isEditing: edit === 'true' });
          }
        }
      }

      if (isValidUser) {
        const matchesSearchBar = SEARCH_BAR_REGEXES.some(({ integration, regex }) => {
          const integrationSetting = searchBarSettings[integration.type];
          return (!integrationSetting || !integrationSetting.disabled) && url.match(regex);
        });

        const shouldToggleSearchBar = matchesSearchBar
          ? !onlyShowSearchBar && !dockVisible && !toggleTabShown
          : onlyShowSearchBar;

        if (shouldToggleSearchBar) {
          toggleSearchBar();
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
      updateCreateAnswerEditor,
      requestLogAudit,
      isValidUser
    } = this.props;

    this.openDock();

    if (isValidUser) {
      let url;
      switch (action) {
        case CHROME.MESSAGE.SEARCH: {
          url = ROUTES.ASK;
          if (showAskTeammate) {
            toggleAskTeammate();
          }
          updateAskSearchText(selectedText);
          requestLogAudit(PROFILE.AUDIT.TYPE.CONTEXT_MENU_SEARCH, { query: selectedText });
          break;
        }
        case CHROME.MESSAGE.CREATE: {
          url = ROUTES.CREATE;
          updateCreateAnswerEditor(
            EditorState.createWithContent(ContentState.createFromText(selectedText))
          );
          break;
        }
        default:
          break;
      }

      history.push(url);
    }
  };

  handleNotificationOpened = ({ type, id }) => {
    const { openCard, requestGetTasks, isValidUser } = this.props;

    this.openDock();

    if (isValidUser) {
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
    const { prevUrl } = this.state;
    return (
      <>
        <ExternalVerification url={prevUrl} />
      </>
    );
  }
}

ChromeMessageListener.propTypes = {
  // Redux State
  dockVisible: PropTypes.bool.isRequired,
  toggleTabShown: PropTypes.bool.isRequired,
  onlyShowSearchBar: PropTypes.bool.isRequired,
  showAskTeammate: PropTypes.bool.isRequired,
  autofindShown: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isValidUser: PropTypes.bool.isRequired,
  searchBarSettings: PropTypes.objectOf({
    disabled: PropTypes.bool
  }),

  // Redux Actions
  toggleDock: PropTypes.func.isRequired,
  minimizeDock: PropTypes.func.isRequired,
  toggleAutofindTab: PropTypes.func.isRequired,
  toggleSearchBar: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  updateAskSearchText: PropTypes.func.isRequired,
  toggleAskTeammate: PropTypes.func.isRequired,
  updateCreateAnswerEditor: PropTypes.func.isRequired,
  requestGetTasks: PropTypes.func.isRequired,
  updateTasksTab: PropTypes.func.isRequired,
  updateTasksOpenSection: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired
};

export default ChromeMessageListener;
