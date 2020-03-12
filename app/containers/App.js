import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { CARD_URL_REGEX, SLACK_URL_REGEX, SEARCH_TYPE } from '../utils/constants';
import queryString from 'query-string';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../actions/display';
import { requestGetUser } from '../actions/profile';
import { requestGetTasks } from '../actions/tasks';
import { openCard } from '../actions/cards';

import Header from '../components/app/Header';
import ChromeMessageListener from '../components/app/ChromeMessageListener';

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';
import Cards from './Cards';
import AISuggest from './AISuggest';
import Profile from './Profile';
import Login from './Login';
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
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        requestGetUser,
        requestGetTasks,
        openCard,
      },
      dispatch
    )
)

class App extends Component {
  componentDidMount() {
    const { isLoggedIn, requestGetTasks, requestGetUser } = this.props;

    if (isLoggedIn) {
      requestGetUser();
      requestGetTasks();
      this.openChromeExtension();
    }
  }

  openChromeExtension = () => {
    const url = window.location.href;
    const cardRes = url.match(CARD_URL_REGEX);
    const slackRes = url.match(SLACK_URL_REGEX);

    if (cardRes) {
      const { edit, sxsrf } = queryString.parse(window.location.search);
      if (!this.props.dockVisible) {
        this.props.toggleDock();
      }
      this.props.openCard({ _id: sxsrf, isEditing: edit === 'true' });

      // Strip off everything after .com. NOTE: For now, assume we will be on .com website
      // (likely will be addomni.com)
      window.history.replaceState({}, window.location.title, url.substring(0, url.indexOf('.com') + 4));
    } else if (slackRes) {
      if (!this.props.dockVisible) {
        this.props.toggleDock();
      }
    }
  }

  render() {
    const {
      dockVisible,
      dockExpanded,
      isLoggedIn,
      showAISuggest,
      location: { pathname }
    } = this.props;
    const showFullDock = dockExpanded || (pathname !== '/ask' && pathname !== '/login');

    return (
      <div className={s('app-container')}>
        <ChromeMessageListener />
        { isLoggedIn && dockVisible && <Cards />}
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
          <div className={s(`flex flex-col ${showFullDock ? 'h-screen' : ''}`)}>
            { isLoggedIn && <Header /> }
            <Switch>
              { isLoggedIn && <Route path="/ask" component={Ask} /> }
              { isLoggedIn && <Route path="/create" component={Create} /> }
              { isLoggedIn && <Route path="/navigate" component={Navigate} /> }
              { isLoggedIn && <Route path="/tasks" component={Tasks} /> }
              { isLoggedIn && <Route path="/profile" component={Profile} /> }
              { isLoggedIn && showAISuggest && <Route path="/suggest" component={AISuggest} /> }
              { !isLoggedIn && <Route path="/login" component={Login} /> }

              {/* A catch-all route: put all other routes ABOVE here */}
              <Redirect to={isLoggedIn ? '/ask' : '/login'} />
            </Switch>
          </div>
        </Dock>
      </div>
    );
  }
}
export default withRouter(App);
