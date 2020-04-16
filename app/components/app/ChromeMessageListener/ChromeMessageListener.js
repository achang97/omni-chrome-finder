import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { EditorState, ContentState } from 'draft-js';

import { CHROME, SEARCH, ROUTES, MAIN_CONTAINER_ID, INTEGRATIONS, URL } from 'appConstants';
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

    this.openChromeExtension();
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasLoaded && this.props.isLoggedIn) {
      const prevEnabled = this.isAutofindEnabled(prevProps.autofindPermissions);
      const currEnabled = this.isAutofindEnabled();

      if (!prevEnabled && currEnabled) {
        this.handlePageLoad(true);
      } else if (prevEnabled && !currEnabled) {
        this.props.clearSearchCards(SEARCH.TYPE.AI_SUGGEST);
      }
    }
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handlePageLoad);

    this.disconnectMutatorObserver();
  }

  openChromeExtension = () => {
    const { dockVisible, toggleDock, openCard, isLoggedIn } = this.props;
    if (window.location.href.startsWith(URL.EXTENSION)) {
      if (!dockVisible) {
        toggleDock();
      }

      if (isLoggedIn) {
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

  openTask = (taskId) => {
    const { tasks, updateTasksTab, updateTasksOpenSection, history } = this.props;
    if (taskId) {
      const task = tasks.find(({ _id }) => _id === taskId);
      if (task) {
        if (task.status === TASKS.TYPE.NEEDS_APPROVAL) {
          // Go to Needs Approval Tab
          updateTasksTab(1);
        } else {
          updateTasksTab(0);
          const taskSectionType = TASKS.SECTIONS.find(({ taskTypes }) => (
            taskTypes.length === 1 && taskTypes[0] === task.status
          ));
          updateTasksOpenSection(taskSectionType ? taskSectionType.type : TASKS.SECTION_TYPE.ALL);
        }
        history.push(ROUTES.TASKS);
      }
    }
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
      this.handlePageUpdate(false);
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  }

  getGoogleText = () => {
    let text = '';

    if (document) {
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
              const removeTables = emailCopy.querySelectorAll('table');
              removeTables.forEach(table => table.remove());

              const removeSignature = emailCopy.querySelector('[data-smartmail="gmail_signature"]');
              if (removeSignature) {
                removeSignature.remove();
              }

              innerText = emailCopy.innerText;
            } else {
              innerText = email.innerText;
            }
          
            text += `${innerText.trim()}\n\n`;
          }
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
    this.handlePageUpdate(true);

    if (!this.state.hasLoaded) {
      this.setState({ hasLoaded: true });
    }
  };

  handlePageUpdate = (isNewPage) => {
    const { isLoggedIn, dockVisible, isVerified, requestSearchCards, clearSearchCards, autofindPermissions } = this.props;

    const integration = this.getIntegration();
    if (isLoggedIn && isVerified && autofindPermissions[integration]) {
      if (isNewPage) {
        this.disconnectMutatorObserver();
      }

      const pageText = this.getPageText(integration);
      if (pageText && pageText !== '') {
        requestSearchCards(SEARCH.TYPE.AI_SUGGEST, { text: pageText });
      } else if (isNewPage) {
        clearSearchCards(SEARCH.TYPE.AI_SUGGEST);
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
      // Open dock
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      let url;
      switch (action) {
        case CHROME.MESSAGE.ASK: {
          url = ROUTES.ASK;
          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          break;
        }
        case CHROME.MESSAGE.CREATE: {
          url = ROUTES.CREATE;
          updateCreateAnswerEditor(EditorState.createWithContent(ContentState.createFromText(selectedText)));
          break;
        }
        case CHROME.MESSAGE.SEARCH: {
          url = ROUTES.NAVIGATE;
          updateNavigateSearchText(selectedText);
          break;
        }
      }

      history.push(url);
    }
  }

  handleNotificationOpened = ({ type, id }) => {
    const {
      isLoggedIn, isVerified, dockVisible, tasks,
      toggleDock,
      openCard,
      requestGetTasks, updateTasksTab, updateTasksOpenSection,
      history
    } = this.props;

    if (!dockVisible) {
      toggleDock();
    }

    if (isLoggedIn && isVerified) {
      const { location: { pathname } } = history;

      switch (type) {
        case CHROME.NOTIFICATION_TYPE.TASK: {
          if (location === ROUTES.TASKS) {
            requestGetTasks();
          }
          this.openTask(id);
          break;
        }
        case CHROME.NOTIFICATION_TYPE.CARD: {
          openCard({ _id: id });
          break;
        }
      }
    }
  }

  listener = (msg) => {
    const { type, payload } = msg;
    switch (msg.type) {
      case CHROME.MESSAGE.TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case CHROME.MESSAGE.TAB_UPDATE: {
        this.openChromeExtension();
        this.handlePageUpdate(true);
        break;
      }
      case CHROME.MESSAGE.SEARCH:
      case CHROME.MESSAGE.ASK:
      case CHROME.MESSAGE.CREATE: {
        this.handleContextMenuAction(type, payload.selectionText);
        break;
      }
      case CHROME.MESSAGE.NOTIFICATION_OPENED: {
        this.handleNotificationOpened(payload);
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

export default ChromeMessageListener;