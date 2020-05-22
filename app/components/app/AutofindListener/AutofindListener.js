import { Component } from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS, SEARCH, CHROME } from 'appConstants';

const URL_REGEXES = [
  {
    integration: INTEGRATIONS.GMAIL.type,
    regex: /https:\/\/mail\.google\.com\/mail\/u\/\d+\/(#\S+)\/.+/
  }
];

class AutofindListener extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      prevText: ''
    };
  }

  componentDidMount() {
    window.addEventListener('load', this.handlePageLoad);
    chrome.runtime.onMessage.addListener(this.listener);
  }

  componentDidUpdate(prevProps) {
    const { hasLoaded } = this.state;
    const { clearSearchCards, isValidUser } = this.props;

    if (hasLoaded && isValidUser) {
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
    window.removeEventListener('load', this.handlePageLoad);
    chrome.runtime.onMessage.removeListener(this.listener);
    this.disconnectMutatorObserver();
  }

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
    const { autofindPermissions: propsAutofindPermissions } = this.props;
    const permissionsObj = autofindPermissions || propsAutofindPermissions;
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
    const { hasLoaded } = this.state;
    this.handlePageUpdate(true);

    if (!hasLoaded) {
      this.setState({ hasLoaded: true });
    }
  };

  handlePageUpdate = (isNewPage) => {
    const { requestSearchCards, clearSearchCards, autofindPermissions, isValidUser } = this.props;
    const { prevText } = this.state;

    const integration = this.getIntegration();
    if (isValidUser && autofindPermissions[integration]) {
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

  listener = (msg) => {
    const { type } = msg;
    switch (type) {
      case CHROME.MESSAGE.TAB_UPDATE: {
        this.handlePageUpdate(true);
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

AutofindListener.propTypes = {
  // Redux State
  autofindPermissions: PropTypes.shape({
    gmail: PropTypes.bool,
    zendesk: PropTypes.bool,
    helpscout: PropTypes.bool,
    salesforce: PropTypes.bool,
    jira: PropTypes.bool,
    hubspot: PropTypes.bool
  }).isRequired,
  isValidUser: PropTypes.bool.isRequired,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired
};

export default AutofindListener;
