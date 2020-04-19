import React, { useEffect } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import queryString from 'query-string';

import { ROUTES, URL } from 'appConstants';
import { heap, auth } from 'utils';

import { Header, ChromeMessageListener, MessageModal} from 'components/app';
import { PublicRoute, PrivateRoute } from 'components/routes';

import Ask from '../Ask';
import Create from '../Create';
import Navigate from '../Navigate';
import Tasks from '../Tasks';
import Cards from '../Cards';
import AISuggest from '../AISuggest';
import Profile from '../Profile';
import Login from '../Login';
import Signup from '../Signup';
import Verify from '../Verify';
import CompleteOnboarding from '../CompleteOnboarding';
import ForgotPassword from '../ForgotPassword';

import 'react-toggle/style.css';
import 'react-circular-progressbar/dist/styles.css';
import 'react-image-lightbox/style.css';
import 'video-react/dist/video-react.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-image-crop/dist/ReactCrop.css';

import style from './App.css';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const dockPanelStyles = {
  background: 'white',
  borderRadius: '8px 0 0 8px'
};

const App = ({ 
  dockVisible, dockExpanded, isLoggedIn, user, showAISuggest, location: { pathname }, history,
  toggleDock, requestGetUser, requestGetTasks, openCard,
}) => {
  useEffect(() => {
    if (isLoggedIn) {
      requestGetUser();
      heap.identifyUser(user);
      if (user && user.isVerified) {
        requestGetTasks();
      }
    }
  }, []);

  const isVerified = user && user.isVerified;
  const completedOnboarding = user && auth.hasCompletedOnboarding(user.onboarding);
  const showFullDock = isLoggedIn && isVerified && completedOnboarding && (dockExpanded || (pathname !== ROUTES.ASK));
  
  return (
    <div className={s('app-container')}>
      <ChromeMessageListener />
      { isLoggedIn && isVerified && dockVisible && <Cards />}
      <Dock
        position="right"
        fluid={false}
        dimMode="none"
        size={350}
        isVisible={dockVisible}
        dockStyle={{
          height: showFullDock ? '100%' : 'auto',
          ...dockPanelStyles
        }}
      >
        <div className={s(`flex relative flex-col ${showFullDock ? 'h-screen' : ''}`)}>
          <MessageModal />
          { isLoggedIn && isVerified && completedOnboarding && <Header /> }
          <Switch>
            <PrivateRoute path={ROUTES.ASK} component={Ask} />
            <PrivateRoute path={ROUTES.CREATE} component={Create} />
            <PrivateRoute path={ROUTES.NAVIGATE} component={Navigate} />
            <PrivateRoute path={ROUTES.TASKS} component={Tasks} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
            { !completedOnboarding && <PrivateRoute path={ROUTES.COMPLETE_ONBOARDING} component={CompleteOnboarding} /> }
            { !isVerified && <PrivateRoute path={ROUTES.VERIFY} component={Verify} /> }
            { showAISuggest && <PrivateRoute path={ROUTES.SUGGEST} component={AISuggest} /> }

            <PublicRoute path={ROUTES.LOGIN} component={Login} />
            <PublicRoute path={ROUTES.SIGNUP} component={Signup} />
            <PublicRoute path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />

            {/* A catch-all route: put all other routes ABOVE here */}
            <Redirect to={isLoggedIn ? ROUTES.ASK : ROUTES.LOGIN } />
          </Switch>
        </div>
      </Dock>
    </div>
  );
}
export default App;
