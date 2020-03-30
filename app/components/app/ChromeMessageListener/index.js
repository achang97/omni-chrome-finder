import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';
import { updateAskSearchText, updateAskQuestionTitle } from '../../../actions/ask';
import { requestSearchCards, clearSearchCards } from '../../../actions/search';
import { updateCreateAnswerEditor } from '../../../actions/create';
import { updateNavigateSearchText } from '../../../actions/navigate';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from '../../../actions/tasks';

import { CHROME_MESSAGE, MAIN_CONTAINER_ID, SEARCH_TYPE, TASKS_SECTIONS, TASKS_SECTION_TYPE, TASK_TYPE, INTEGRATIONS} from '../../../utils/constants';

import AISuggestTab from '../AISuggestTab';

const URL_REGEXES = [
  {
    integration: INTEGRATIONS.GMAIL.type,
    regex: /https:\/\/mail\.google\.com\/mail\/u\/\d+\/(#\S+)\/.+/
  }
];

class ChromeMessageListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
    }
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handlePageLoad);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasLoaded && this.props.isLoggedIn) {
      const prevEnabled = this.isAutofindEnabled(prevProps.autofindPermissions);
      const currEnabled = this.isAutofindEnabled();

      if (!prevEnabled && currEnabled) {
        this.handlePageLoad(true);
      } else if (prevEnabled && !currEnabled) {
        this.props.clearSearchCards(SEARCH_TYPE.AI_SUGGEST);
      }
    }
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handlePageLoad);

    this.disconnectMutatorObserver();
  }

  disconnectMutatorObserver = () => {
    if (this.observer) {
      // Later, you can stop observing
      this.observer.disconnect();
      this.observer = null;
    }
  }

  createMutator(targetNode, config) {
    const callback = (mutations) => {
      this.handleTabUpdate(false);
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  }

  getGoogleText = () => {
    let text = '';

    const mainTable = document.querySelector('div[role="main"] table[role="presentation"]');

    const titleDiv = mainTable.querySelector('[tabindex="-1"]');
    if (titleDiv) {
      text += `${titleDiv.innerText}\n\n`;
    }

    const emailList = mainTable.querySelector('[role="list"]');
    if (emailList) {
      if (!this.observer) {
        this.createMutator(emailList, { subtree: true, childList: true });
      }

      for (let i = 0; i < emailList.children.length; i++) {
        const email = emailList.children[i];

        if (email.getAttribute('role') === 'listitem') {
          let innerText;
          if (i === emailList.children.length - 1) {
            const emailCopy = email.cloneNode(true);
            const removeTables = emailCopy.querySelectorAll('[role="presentation"]');
            removeTables.forEach(table => table.remove());
            innerText = emailCopy.innerText;
          } else {
            innerText = email.innerText;
          }
        
          text += `${innerText.trim()}\n\n`;
        }
      }
    }

    return text;
  }

  getIntegration = () => {
    const urlRegex = URL_REGEXES.find(({ regex }) => regex.test(window.location.href));
    
    if (urlRegex) {
      return urlRegex.integration;
    } else {
      return null;
    }
  }

  isAutofindEnabled = (autofindPermissions) => {
    const permissionsObj = autofindPermissions || this.props.autofindPermissions;
    const integration = this.getIntegration();
    return integration && permissionsObj && permissionsObj[integration];
  }

  getPageText = (integration) => {
    switch (integration) {
      case INTEGRATIONS.GMAIL.type: {
        return this.getGoogleText();
      }
    }
    
    return '';
  };

  handlePageLoad = () => {
    this.handleTabUpdate(true);

    if (!this.state.hasLoaded) {
      this.setState({ hasLoaded: true });
    }
  };

  handleTabUpdate = (isNewPage) => {
    const { isLoggedIn, isVerified, requestSearchCards, clearSearchCards, autofindPermissions } = this.props;

    const integration = this.getIntegration();
    if (isLoggedIn && isVerified && autofindPermissions[integration]) {
      if (isNewPage) {
        this.disconnectMutatorObserver();
      }

      const pageText = this.getPageText(integration);
      if (pageText && pageText !== '') {
        requestSearchCards(SEARCH_TYPE.AI_SUGGEST, { text: pageText });
      } else if (isNewPage) {
        clearSearchCards(SEARCH_TYPE.AI_SUGGEST);
      }
    }
  };

  handleContextMenuAction = (action, selectedText) => {
    const {
      isLoggedIn, isVerified, dockVisible, dockExpanded, toggleDock, history,
      updateAskSearchText, updateAskQuestionTitle,
      updateCreateAnswerEditor,
      updateNavigateSearchText,
    } = this.props;

    if (!dockVisible) {
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      // Open dock
      let url;
      switch (action) {
        case CHROME_MESSAGE.ASK: {
          url = '/ask';

          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          break;
        }
        case CHROME_MESSAGE.CREATE: {
          url = '/create';
          updateCreateAnswerEditor(EditorState.createWithContent(ContentState.createFromText(selectedText)));
          break;
        }
        case CHROME_MESSAGE.SEARCH: {
          url = '/navigate';
          updateNavigateSearchText(selectedText);
          break;
        }
      }

      history.push(url);
    }
  }

  handleNotificationOpened = (notificationId) => {
    const {
      isLoggedIn, isVerified, dockVisible, tasks,
      toggleDock, requestGetTasks, updateTasksTab, updateTasksOpenSection,
      history
    } = this.props;

    if (!dockVisible) {
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      const { location: { pathname } } = history;

      if (location === '/tasks') {
        requestGetTasks();
      }

      const task = tasks.find(({ _id }) => _id === notificationId);
      if (task) {
        if (task.status === TASK_TYPE.NEEDS_APPROVAL) {
          // Go to Needs Approval Tab
          updateTasksTab(1);
        } else {
          updateTasksTab(0);
          const taskSectionType = TASKS_SECTIONS.find(({ taskTypes }) => (
            taskTypes.length === 1 && taskTypes[0] === task.status
          ));
          updateTasksOpenSection(taskSectionType ? taskSectionType.type : TASKS_SECTION_TYPE.ALL);
        }
      }

      history.push('/tasks');
    }
  }

  listener = (msg) => {
    const { type, payload } = msg;
    switch (msg.type) {
      case CHROME_MESSAGE.TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case CHROME_MESSAGE.TAB_UPDATE: {
        this.handleTabUpdate(true);
        break;
      }
      case CHROME_MESSAGE.SEARCH:
      case CHROME_MESSAGE.ASK:
      case CHROME_MESSAGE.CREATE: {
        this.handleContextMenuAction(type, payload.selectionText);
        break;
      }
      case CHROME_MESSAGE.NOTIFICATION_OPENED: {
        this.handleNotificationOpened(payload.notificationId);
        break;
      }
    }
  };

  render() {
    if (!this.isAutofindEnabled()) {
      return null;
    }

    return <AISuggestTab />;
  }
}

export default connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: !!state.auth.token,
    isVerified: state.profile.user && state.profile.user.isVerified,
    autofindPermissions: state.profile.user ? state.profile.user.autofindPermissions : {},
    tasks: state.tasks.tasks,
  }),
  dispatch =>
    bindActionCreators(
      {
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
      },
      dispatch
    )
)(withRouter(ChromeMessageListener));
