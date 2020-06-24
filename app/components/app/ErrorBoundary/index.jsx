import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { MdError, MdClose, MdCloudDownload } from 'react-icons/md';

import { Dock, Button, Message } from 'components/common';
import { EXTENSION_MESSAGE, MESSAGE, COMMAND } from 'appConstants/chrome';

import { getStyleApplicationFn } from 'utils/style';
import appStyles from 'containers/App/App.css';

import logo from 'assets/images/logos/logo-dark.svg';

const s = getStyleApplicationFn(appStyles);

const DOCK_WIDTH = 300;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      showError: false,
      hasUpdate: false,
      hasReloaded: false
    };
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.chromeListener);
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras({
        ...errorInfo,
        version: this.getVersion()
      });

      Sentry.captureException(error);
    });

    this.setState({ hasError: true });

    // Communicate with background page to get version information?
    chrome.runtime.sendMessage({ type: EXTENSION_MESSAGE.CATCH_ERROR }, (hasUpdate) => {
      this.setState({ hasUpdate });
    });
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.chromeListener);
  }

  getVersion = () => {
    return chrome.runtime.getManifest().version;
  };

  chromeListener = (msg) => {
    const { hasError, showError } = this.state;
    if (hasError) {
      switch (msg.type) {
        case MESSAGE.TOGGLE: {
          this.setState({ showError: !showError });
          break;
        }
        case MESSAGE.SEARCH:
        case MESSAGE.CREATE:
        case MESSAGE.NOTIFICATION_OPENED:
        case COMMAND.OPEN_EXTENSION: {
          this.setState({ showError: true });
          break;
        }
        default:
          break;
      }
    }
  };

  updateExtension = () => {
    chrome.runtime.sendMessage({ type: EXTENSION_MESSAGE.RELOAD_EXTENSION }, () => {
      this.setState({ hasReloaded: true });
    });
  };

  render() {
    const { hasError, showError, hasUpdate, hasReloaded } = this.state;
    const { children } = this.props;

    if (hasError) {
      let title;
      let description;
      let Icon;
      let iconColor;

      if (hasUpdate) {
        Icon = MdCloudDownload;
        iconColor = 'purple-gray-50';
        title = 'New Version Available!';
        description = `Please download the newest version (${this.getVersion()}) of the extension.`;
      } else {
        Icon = MdError;
        iconColor = 'red-500';
        title = 'Something went wrong!';
        description =
          'Our team has been notified and is working to fix these issues. We apologize for the inconvenience.';
      }

      return (
        <div className={s('app-container')}>
          <Dock isVisible={showError} width={DOCK_WIDTH} isFullHeight={false} position="right">
            <div className={s('flex flex-col items-center text-center p-xl relative')}>
              <MdClose
                className={s('absolute top-0 left-0 m-sm text-gray text-sm cursor-pointer')}
                onClick={() => this.setState({ showError: false })}
              />
              <img src={logo} alt="Omni Logo" className={s('self-end h-3xl')} />
              <Icon className={s(`large-icon-container mb-lg text-${iconColor}`)} />
              <div className={s('text-lg font-bold mb-sm')}> {title} </div>
              <div className={s('text-sm text-gray')}>{description}</div>
              {hasUpdate && (
                <>
                  <Button
                    text={hasReloaded ? 'Reload Page' : 'Update Extension'}
                    color="primary"
                    className={s('my-lg py-reg')}
                    onClick={!hasReloaded ? this.updateExtension : () => window.location.reload()}
                  />
                  <Message
                    type="success"
                    animated
                    show={hasReloaded}
                    temporary
                    message={`Updated version to ${this.getVersion()}!`}
                  />
                </>
              )}
            </div>
          </Dock>
        </div>
      );
    }

    // When there's not an error, render children untouched
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
