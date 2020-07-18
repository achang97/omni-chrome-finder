import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

import { ROUTES, APP_CONTAINER_ID, APP_CONTAINER_CLASSNAME } from 'appConstants';
import { auth } from 'utils';
import { UserPropTypes } from 'utils/propTypes';

import {
  Header,
  AutofindListener,
  ChromeMessageListener,
  ExternalVerification,
  ExternalCreateModal,
  ToggleTab,
  MessageModal,
  MinimizeButton,
  SearchBar,
  DisabledAlert
} from 'components/app';
import { Dock } from 'components/common';
import { PublicRoute, PrivateRoute } from 'components/routes';

import { getStyleApplicationFn } from 'utils/style';

import Ask from '../Ask';
// import Create from '../Create';
import Tasks from '../Tasks';
import Cards from '../Cards';
import Autofind from '../Autofind';
import Profile from '../Profile';
import MainAuth from '../MainAuth';
import Login from '../Login';
import Signup from '../Signup';
import Verify from '../Verify';
import CompleteOnboarding from '../CompleteOnboarding';
import ForgotPassword from '../ForgotPassword';

import 'react-circular-progressbar/dist/styles.css';
import 'react-image-lightbox/style.css';
import 'video-react/dist/video-react.css';
import 'react-image-crop/dist/ReactCrop.css';

/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/plugins.pkgd.min.css';
import 'froala-editor/css/froala_editor.min.css';
/* eslint-enable import/no-extraneous-dependencies */

// Overrides
import 'styles/overrides/froala.css';

import style from './App.css';

const s = getStyleApplicationFn(style);

const DOCK_WIDTH = 350;

const App = ({ dockVisible, isLoggedIn, user, showAutofind, requestGetUser, requestGetTasks }) => {
  const isMounted = useRef(null);

  const isVerified = user && user.isVerified;

  useEffect(() => {
    if (isLoggedIn && !isMounted.current) {
      requestGetUser();
      Sentry.configureScope((scope) => scope.setUser({ email: user.email }));
      if (isVerified) {
        requestGetTasks();
      }
    }

    isMounted.current = true;
  }, [isLoggedIn, user, isVerified, requestGetUser, requestGetTasks]);

  const completedOnboarding = auth.hasCompletedOnboarding(user);
  const isValidUser = auth.isValidUser(user) && user.company && !user.company.disabled;

  return (
    <div className={s(APP_CONTAINER_CLASSNAME)} id={APP_CONTAINER_ID}>
      <Dock position="right" width={DOCK_WIDTH} isVisible={dockVisible} isFullHeight={isValidUser}>
        <div className={s(`flex relative flex-col ${isValidUser ? 'h-screen' : ''}`)}>
          <MessageModal />
          <MinimizeButton />
          {isLoggedIn && <DisabledAlert />}
          {isValidUser && <Header />}
          <Switch>
            <PrivateRoute path={ROUTES.ASK} component={Ask} />
            <PrivateRoute path={ROUTES.TASKS} component={Tasks} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
            {!completedOnboarding && (
              <PrivateRoute path={ROUTES.COMPLETE_ONBOARDING} component={CompleteOnboarding} />
            )}
            {!isVerified && <PrivateRoute path={ROUTES.VERIFY} component={Verify} />}
            {showAutofind && <PrivateRoute path={ROUTES.SUGGEST} component={Autofind} />}

            <PublicRoute path={ROUTES.MAIN_AUTH} component={MainAuth} />
            <PublicRoute path={ROUTES.LOGIN} component={Login} />
            <PublicRoute path={ROUTES.SIGNUP} component={Signup} />
            <PublicRoute path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />

            {/* A catch-all route: put all other routes ABOVE here */}
            <Redirect to={isLoggedIn ? ROUTES.ASK : ROUTES.MAIN_AUTH} />
          </Switch>
        </div>
      </Dock>
      <ChromeMessageListener />
      <ToggleTab />
      {isValidUser && (
        <>
          <SearchBar />
          <AutofindListener />
          <ExternalVerification />
          <ExternalCreateModal />
          {dockVisible && <Cards />}
        </>
      )}
    </div>
  );
};

App.propTypes = {
  // Redux State
  dockVisible: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  user: UserPropTypes.isRequired,
  showAutofind: PropTypes.bool.isRequired,

  // Redux Actions
  requestGetUser: PropTypes.func.isRequired,
  requestGetTasks: PropTypes.func.isRequired
};

export default App;
