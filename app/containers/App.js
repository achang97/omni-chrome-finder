import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { CHROME_MESSAGES } from '../utils/constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../actions/display';
import { requestGetUser } from '../actions/auth';
import { openCard } from '../actions/cards';
import Header from '../components/common/Header';
import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';
import Cards from './Cards';
import Profile from './Profile';
import Login from './Login';
import style from './App.css';
import { getStyleApplicationFn } from '../utils/styleHelpers';
const s = getStyleApplicationFn(style);
const dockPanelStyles = {
  background: 'white',
  borderRadius: '8px 0 0 8px'
};

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
    isLoggedIn: state.auth.isLoggedIn,
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        requestGetUser,
        openCard,
      },
      dispatch
    )
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestTabVisible: false
    };
  }
  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.requestGetUser();
      let url = window.location.href;
      //code to pop open chrome extension
      var patt = new RegExp("www.google.com");
      if (url.match(patt)) {
        let cardId = url.split("=")[1];
        this.props.toggleDock();
        this.props.openCard({ _id: cardId, isEditing: true });
      }
    }



    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handleFirstPageLoad);
  }
  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handleFirstPageLoad);
  }
  getPageText = () => {
    // TODO: Basic version that is website agnostic, simply removes chrome extension code, scripts,
    // and styles from DOM and gets inner text. Future version should look at specific divs (ie. title
    // and content of email for Gmail).
    const docCopy = document.cloneNode(true);
    const omniExt = docCopy.getElementById('omni-chrome-ext-main-container');
    omniExt.remove();
    const removeSelectors = ['script', 'noscript', 'style'];
    removeSelectors.forEach((selector) => {
      const elements = docCopy.querySelectorAll(`body ${selector}`);
      for (const elem of elements) {
        elem.remove();
      }
    });
    return docCopy.body.innerText;
  };
  handleFirstPageLoad = () => {
    this.handleTabUpdate(window.location.href);
  };
  handleTabUpdate = (url) => {
    // Placeholder code for AI Suggest, code should be written in another file eventually
    // Case 1: Matches specific email page in Gmail
    if (/https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\/.+/.test(url)) {
      this.setState({ suggestTabVisible: true });
      const text = this.getPageText();
      console.log(text);
    } else {
      this.setState({ suggestTabVisible: false });
    }
  };
  listener = (msg) => {
    const { type, ...restMsg } = msg;
    switch (msg.type) {
      case CHROME_MESSAGES.TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case CHROME_MESSAGES.TAB_UPDATE: {
        const { url } = restMsg;
        this.handleTabUpdate(url);
        break;
      }
    }
  };
  render() {
    const {
      dockVisible,
      dockExpanded,
      toggleDock,
      isLoggedIn,
      location: { pathname }
    } = this.props;
    const { suggestTabVisible, jss } = this.state;
    const showFullDock = dockExpanded || pathname !== '/ask';
    // Solution to CSS isolation taken from https://stackoverflow.com/a/57221293.
    return (
      <div className={s('app-container')}>
        { isLoggedIn && dockVisible && <Cards />}
        { isLoggedIn && suggestTabVisible && ( // TODO: move to new file and style
          <div
            className={s('app-suggest-tab fixed bg-white shadow-md')}
            onClick={() => toggleDock()}
          >
            AI Suggest
          </div>
        )}
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
              { !isLoggedIn && <Route path="/login" component={Login} /> }
              
              {/* A catch-all route: put all other routes ABOVE here */}
              <Redirect to={isLoggedIn ? '/ask' : '/login' } />
            </Switch>
          </div>
        </Dock>
      </div>
    );
  }
}
export default withRouter(App);