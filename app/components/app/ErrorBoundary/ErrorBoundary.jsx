import { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { UserPropTypes } from 'utils/propTypes';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { user } = this.props;

    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      if (user) {
        scope.setUser({ email: user.email });
      }
      scope.setExtra('version', chrome.runtime.getManifest().version);

      Sentry.captureException(error);
      // Sentry.showReportDialog({ eventId });
    });
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
  user: UserPropTypes,
  children: PropTypes.node
};

export default ErrorBoundary;
