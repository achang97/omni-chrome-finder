import { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { EXTENSION_MESSAGE } from 'appConstants/chrome';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras({
        ...errorInfo,
        version: chrome.runtime.getManifest().version
      });

      Sentry.captureException(error);
    });

    this.setState({ hasError: true });

    // Communicate with background page to get version information?
    chrome.runtime.sendMessage({ type: EXTENSION_MESSAGE.CATCH_ERROR });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return null;
    }

    // When there's not an error, render children untouched
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
