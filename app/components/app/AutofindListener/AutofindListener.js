import { Component } from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS, SEARCH } from 'appConstants';
import { getGoogleText } from './parsers';

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
  }

  componentDidUpdate(prevProps) {
    const { hasLoaded } = this.state;
    const { clearSearchCards, windowUrl } = this.props;

    if (hasLoaded) {
      const prevEnabled = this.isAutofindEnabled(prevProps.autofindPermissions);
      const currEnabled = this.isAutofindEnabled();

      if (windowUrl !== prevProps.windowUrl) {
        this.handlePageUpdate(true);
      } else if (!prevEnabled && currEnabled) {
        this.handlePageLoad();
      } else if (prevEnabled && !currEnabled) {
        clearSearchCards(SEARCH.SOURCE.AUTOFIND);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handlePageLoad);
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
        return getGoogleText(this.observer, this.createMutator);
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
    const { requestSearchCards, clearSearchCards, autofindPermissions } = this.props;
    const { prevText } = this.state;

    const integration = this.getIntegration();
    if (autofindPermissions[integration]) {
      if (isNewPage) {
        this.disconnectMutatorObserver();
      }

      const pageText = this.getPageText(integration);
      if (pageText !== prevText || isNewPage) {
        this.setState({ prevText: pageText });
        if (pageText && pageText !== '') {
          requestSearchCards(SEARCH.SOURCE.AUTOFIND, { text: pageText });
        } else if (isNewPage) {
          clearSearchCards(SEARCH.SOURCE.AUTOFIND);
        }
      }
    } else {
      if (prevText !== '') {
        this.setState({ prevText: '' });
      }

      clearSearchCards(SEARCH.SOURCE.AUTOFIND);
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
  windowUrl: PropTypes.string,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired
};

export default AutofindListener;
