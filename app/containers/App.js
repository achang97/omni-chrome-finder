import React, { Component } from 'react';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { ROUTES, WEB_APP_EXTENSION_URL, TASKS_SECTIONS, TASKS_SECTION_TYPE, TASK_TYPE, SEARCH_TYPE, NOOP } from '../utils/constants';
import { identifyUser } from '../utils/heap';
import queryString from 'query-string';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../actions/display';
import { requestGetUser } from '../actions/profile';
import { requestGetTasks, updateTasksOpenSection, updateTasksTab } from '../actions/tasks';
import { openCard } from '../actions/cards';

import Header from '../components/app/Header';
import ChromeMessageListener from '../components/app/ChromeMessageListener';
import VerifySuccessModal from '../components/app/VerifySuccessModal';

import PublicRoute from '../components/routes/PublicRoute';
import PrivateRoute from '../components/routes/PrivateRoute';

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';
import Cards from './Cards';
import AISuggest from './AISuggest';
import Profile from './Profile';
import Login from './Login';
import Signup from './Signup';
import Verify from './Verify';

import 'react-toggle/style.css';
import 'react-circular-progressbar/dist/styles.css';
import 'react-image-lightbox/style.css';

import style from './App.css';

import { getStyleApplicationFn } from '../utils/style';
const s = getStyleApplicationFn(style);
const dockPanelStyles = {
  background: 'white',
  borderRadius: '8px 0 0 8px'
};

class App extends Component {
  componentDidMount() {
    const { isLoggedIn, requestGetTasks, requestGetUser, user } = this.props;

    if (isLoggedIn) {
      requestGetUser();
      identifyUser(user);
      if (user && user.isVerified) {
        requestGetTasks();
      }
    }

    this.openChromeExtension();
  }

  openChromeExtension = () => {
    const {
      dockVisible, tasks, isLoggedIn,
      toggleDock, openCard, updateTasksTab, updateTasksOpenSection, history
    } = this.props;

    if (window.location.href.startsWith(WEB_APP_EXTENSION_URL)) {
      if (!dockVisible) {
        toggleDock();
      }

      if (isLoggedIn) {
        const { taskId, cardId, edit } = queryString.parse(window.location.search);

        if (taskId) {
          const task = tasks.find(({ _id }) => _id === taskId);
          if (task) {
            if (task.status === TASK_TYPE.NEEDS_APPROVAL) {
              // Go to Needs Approval Tab
              updateTasksTab(1);
            } else {
              updateTasksTab(0);
              const taskSectionType = TASKS_SECTIONS.find(({ taskTypes }) => (
                taskTypes.length === 1 && taskTypes[0] === task.status
              ));
              updateTasksOpenSection(taskSectionType ? taskSectionType.type : TASKS_SECTION_TYPE.ALL);
            }
            history.push(ROUTES.TASKS);
          }
        }

        if (cardId) {
          openCard({ _id: cardId, isEditing: edit === 'true' });
        }        
      }
    }
  }

  render() {
    const {
      dockVisible,
      dockExpanded,
      isLoggedIn,
      showAISuggest,
      user,
      location: { pathname }
    } = this.props;

    const isVerified = user && user.isVerified;
    const showFullDock = dockExpanded || (pathname !== ROUTES.ASK && isLoggedIn && isVerified);

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
            <VerifySuccessModal />
            { isLoggedIn && isVerified && <Header /> }
            <Switch>
              <PrivateRoute path={ROUTES.ASK} component={Ask} />
              <PrivateRoute path={ROUTES.CREATE} component={Create} />
              <PrivateRoute path={ROUTES.NAVIGATE} component={Navigate} />
              <PrivateRoute path={ROUTES.TASKS} component={Tasks} />
              <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
              { !isVerified && <PrivateRoute path={ROUTES.VERIFY} component={Verify} /> }
              { showAISuggest && <PrivateRoute path={ROUTES.SUGGEST} component={AISuggest} /> }

              <PublicRoute path={ROUTES.LOGIN} component={Login} />
              <PublicRoute path={ROUTES.SIGNUP} component={Signup} />

              {/* A catch-all route: put all other routes ABOVE here */}
              <Redirect to={isLoggedIn ? ROUTES.ASK : ROUTES.LOGIN } />
            </Switch>
          </div>
        </Dock>
      </div>
    );
  }
}
export default connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: !!state.auth.token,
    showAISuggest: state.search.cards[SEARCH_TYPE.AI_SUGGEST].cards.length !== 0,
    tasks: state.tasks.tasks,
    user: state.profile.user,
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        requestGetUser,
        requestGetTasks,
        updateTasksTab,
        updateTasksOpenSection,
        openCard,
      },
      dispatch
    )
)(withRouter(App));
