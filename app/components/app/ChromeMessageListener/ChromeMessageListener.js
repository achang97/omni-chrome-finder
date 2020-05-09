import { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { EditorState, ContentState } from 'draft-js';

import { CHROME, SEARCH, ROUTES, INTEGRATIONS, URL, TASKS, PROFILE } from 'appConstants';

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
      prevText: '',
      prevUrl: null
    };
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handlePageLoad);

    this.openChromeExtension();
  }

  componentDidUpdate(prevProps) {
    const { hasLoaded } = this.state;
    const { clearSearchCards } = this.props;

    if (hasLoaded && this.isValidUser()) {
      const prevEnabled = this.isAutofindEnabled(prevProps.autofindPermissions);
      const currEnabled = this.isAutofindEnabled();

      if (!prevEnabled && currEnabled) {
        this.handlePageLoad();
      } else if (prevEnabled && !currEnabled) {
        clearSearchCards(SEARCH.TYPE.AUTOFIND);
      }
    }
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handlePageLoad);

    this.disconnectMutatorObserver();
  }

  isValidUser = () => {
    const { isLoggedIn, isVerified, hasCompletedOnboarding } = this.props;
    return isLoggedIn && isVerified && hasCompletedOnboarding;
  };

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
    const { openCard } = this.props;

    if (this.hasUrlChanged()) {
      if (window.location.href.startsWith(URL.EXTENSION)) {
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

  disconnectMutatorObserver = () => {
    if (this.observer) {
      // Later, you can stop observing
      this.observer.disconnect();
      this.observer = null;
    }
  };

  createMutator = (targetNode, config) => {
    const callback = () => {
      this.handlePageUpdate(false);
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  };

  trimAlphanumeric = (text) => {
    return text.replace(/^[^a-z\d]+|[^a-z\d]+$/gi, '');
  };

  removeAll = (nodes, transform) => {
    nodes.forEach((node) => {
      if (transform) {
        // eslint-disable-next-line no-param-reassign
        node = transform(node);
      }

      if (node) {
        node.remove();
      }
    });
  };

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
            const emailCopy = email.cloneNode(true);

            const removeFwds = emailCopy.querySelectorAll('.gmail_quote');
            this.removeAll(removeFwds);

            const removeShowContentToggle = [
              ...emailCopy.querySelectorAll('[aria-label="Show trimmed content"]'),
              ...emailCopy.querySelectorAll('[aria-label="Hide expanded content"]')
            ];
            this.removeAll(removeShowContentToggle, (toggle) => toggle.parentElement.nextSibling);

            const removeTables = emailCopy.querySelectorAll('table');
            this.removeAll(removeTables);

            const removeSignatures = emailCopy.querySelectorAll(
              '[data-smartmail="gmail_signature"]'
            );
            this.removeAll(removeSignatures);

            const textContent = this.trimAlphanumeric(emailCopy.textContent);
            text += `${textContent}\n\n`;
          }
        }
      }
    }

    return text;
  };

  getIntegration = () => {
    const urlRegex = URL_REGEXES.find(({ regex }) => regex.test(window.location.href));

    if (urlRegex) {
      return urlRegex.integration;
    }
    return null;
  };

  isAutofindEnabled = (autofindPermissions) => {
    const permissionsObj = autofindPermissions || this.props.autofindPermissions;
    const integration = this.getIntegration();
    return integration && permissionsObj && permissionsObj[integration];
  };

  getPageText = (integration) => {
    switch (integration) {
      case INTEGRATIONS.GMAIL.type: {
        return this.getGoogleText();
      }
      default:
        break;
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
    const { requestSearchCards, clearSearchCards, autofindPermissions } = this.props;
    const { prevText } = this.state;

    const integration = this.getIntegration();
    if (this.isValidUser() && autofindPermissions[integration]) {
      if (isNewPage) {
        this.disconnectMutatorObserver();
      }

      const pageText = this.getPageText(integration);
      if (pageText !== prevText) {
        this.setState({ prevText: pageText });
        if (pageText && pageText !== '') {
          requestSearchCards(SEARCH.TYPE.AUTOFIND, { text: pageText });
        } else if (isNewPage) {
          clearSearchCards(SEARCH.TYPE.AUTOFIND);
        }
      }
    } else {
      if (prevText !== '') {
        this.setState({ prevText: '' });
      }

      clearSearchCards(SEARCH.TYPE.AUTOFIND);
    }
  };

  handleContextMenuAction = (action, selectedText) => {
    const {
      dockExpanded,
      history,
      updateAskSearchText,
      updateAskQuestionTitle,
      updateCreateAnswerEditor,
      requestLogAudit
    } = this.props;

    this.openDock();

    if (this.isValidUser()) {
      let url;
      switch (action) {
        case CHROME.MESSAGE.SEARCH: {
          url = ROUTES.ASK;
          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          requestLogAudit(PROFILE.AUDIT_TYPE.CONTEXT_MENU_SEARCH, { query: selectedText });
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
    const { type, payload } = msg;
    switch (type) {
      // Messages
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
  dockExpanded: PropTypes.bool.isRequired,
  autofindShown: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isVerified: PropTypes.bool.isRequired,
  autofindPermissions: PropTypes.shape({
    gmail: PropTypes.bool,
    zendesk: PropTypes.bool,
    helpscout: PropTypes.bool,
    salesforce: PropTypes.bool,
    jira: PropTypes.bool,
    hubspot: PropTypes.bool
  }).isRequired,
  hasCompletedOnboarding: PropTypes.bool.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired
    })
  ).isRequired,

  // Redux Actions
  toggleDock: PropTypes.func.isRequired,
  minimizeDock: PropTypes.func.isRequired,
  toggleAutofindTab: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  updateAskSearchText: PropTypes.func.isRequired,
  updateAskQuestionTitle: PropTypes.func.isRequired,
  updateCreateAnswerEditor: PropTypes.func.isRequired,
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestGetTasks: PropTypes.func.isRequired,
  updateTasksTab: PropTypes.func.isRequired,
  updateTasksOpenSection: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired
};

export default ChromeMessageListener;
