import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { CARD_URL_REGEX, SLACK_URL_REGEX, TASK_URL_REGEX, TASKS_SECTIONS, TASKS_SECTION_TYPE, TASK_TYPE, SEARCH_TYPE, NOOP } from '../utils/constants';
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

import style from './App.css';

import { getStyleApplicationFn } from '../utils/style';
const s = getStyleApplicationFn(style);
const dockPanelStyles = {
  background: 'white',
  borderRadius: '8px 0 0 8px'
};

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: !!state.auth.token,
    showAISuggest: state.search.cards[SEARCH_TYPE.AI_SUGGEST].cards.length !== 0,
    tasks: state.tasks.tasks,
    isVerified: state.profile.user && state.profile.user.isVerified,
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
)

class App extends Component {
  componentDidMount() {
    const { isLoggedIn, isVerified, requestGetTasks, requestGetUser } = this.props;

    if (isLoggedIn) {
      requestGetUser();

      if (isVerified) {
        requestGetTasks();
        this.openChromeExtension();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVerified && this.props.isVerified) {
      this.openChromeExtension();
    }
  }

  clearUrl = (url) => {
    // Strip off everything after .com. NOTE: For now, assume we will be on .com website
    // (likely will be addomni.com)
    window.history.replaceState({}, window.location.title, url.substring(0, url.indexOf('.com') + 4));
  }

  openChromeExtension = () => {
    const url = window.location.href;
    const {
      dockVisible, tasks,
      toggleDock, openCard, updateTasksTab, updateTasksOpenSection, history
    } = this.props;

    const urlResponses = [
      {
        regex: CARD_URL_REGEX,
        callback: () => {
          const { edit, sxsrf } = queryString.parse(window.location.search);
          openCard({ _id: sxsrf, isEditing: edit === 'true' });
        }
      },      
      {
        regex: SLACK_URL_REGEX,
        callback: NOOP,
      },
      {
        regex: TASK_URL_REGEX,
        callback: (res) => {
          const taskId = res[1];
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
          }
          history.push('/tasks');
        }
      }
    ]

    urlResponses.forEach(({ regex, callback }) => {
      const res = url.match(regex);
      if (res) {
        if (!dockVisible) {
          toggleDock();
        }
        callback(res);
        this.clearUrl(url);        
      }
    });
  }

  render() {
    const {
      dockVisible,
      dockExpanded,
      isLoggedIn,
      showAISuggest,
      isVerified,
      location: { pathname }
    } = this.props;

    const showFullDock = dockExpanded || (pathname !== '/ask' && isLoggedIn && isVerified);

    let redirectLink;
    if (isLoggedIn) {
      redirectLink = isVerified ? '/ask' : '/verify';
    } else {
      redirectLink = '/login';
    }

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
              { isVerified && isLoggedIn && <Route path="/ask" component={Ask} /> } }
              { isVerified && isLoggedIn && <Route path="/create" component={Create} /> }
              { isVerified && isLoggedIn && <Route path="/navigate" component={Navigate} /> }
              { isVerified && isLoggedIn && <Route path="/tasks" component={Tasks} /> }
              { isVerified && isLoggedIn && <Route path="/profile" component={Profile} /> }
              { isVerified && isLoggedIn && showAISuggest && <Route path="/suggest" component={AISuggest} /> }

              { !isVerified && isLoggedIn && <Route path="/verify" component={Verify} /> }

              { !isLoggedIn && <Route path="/login" component={Login} /> }
              { !isLoggedIn && <Route path="/signup" component={Signup} /> }

              {/* A catch-all route: put all other routes ABOVE here */}
              <Redirect to={redirectLink} />
            </Switch>
          </div>
        </Dock>
      </div>
    );
  }
}
export default withRouter(App);
