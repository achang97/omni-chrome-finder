import { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

class ExampleBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      Sentry.showReportDialog({ eventId });
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

ExampleBoundary.propTypes = {
  children: PropTypes.node
};

export default ExampleBoundary;
