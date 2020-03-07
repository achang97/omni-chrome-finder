import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { CHROME_MESSAGE, CARD_URL_REGEX, SLACK_URL_REGEX } from '../utils/constants';
import queryString from 'query-string';
import { EditorState, ContentState } from 'draft-js';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateAskSearchText, updateAskQuestionTitle } from '../actions/ask';
import { updateCreateAnswerEditor } from '../actions/create';
import { updateNavigateSearchText } from '../actions/navigate';
import { toggleDock } from '../actions/display';
import { requestGetUser } from '../actions/profile';
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
    isLoggedIn: !!state.auth.token,
  }),
  dispatch =>
    bindActionCreators(
      {
        toggleDock,
        requestGetUser,
        openCard,
        updateAskSearchText,
        updateAskQuestionTitle,
        updateCreateAnswerEditor,
        updateNavigateSearchText,
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
      this.openChromeExtension();
    }

    chrome.runtime.onMessage.addListener(this.listener);
    window.addEventListener('load', this.handleFirstPageLoad);
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
    window.removeEventListener('load', this.handleFirstPageLoad);
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
    } else {
      this.setState({ suggestTabVisible: false });
    }
  };

  handleContextMenuAction = (action, selectedText) => {
    const {
      isLoggedIn, dockVisible, dockExpanded, toggleDock, history,
      updateAskSearchText, updateAskQuestionTitle,
      updateCreateAnswerEditor,
      updateNavigateSearchText,
    } = this.props;

    if (isLoggedIn) {
      // Open dock
      if (!dockVisible) {
        toggleDock();
      }

      let url;
      switch (action) {
        case CHROME_MESSAGE.ASK: {
          url = '/ask';

          if (dockExpanded) {
            updateAskQuestionTitle(selectedText);
          } else {
            updateAskSearchText(selectedText);
          }
          break;
        }
        case CHROME_MESSAGE.CREATE: {
          url = '/create';
          updateCreateAnswerEditor(EditorState.createWithContent(ContentState.createFromText(selectedText)));
          break;
        }        
        case CHROME_MESSAGE.SEARCH: {
          url = '/navigate';
          updateNavigateSearchText(selectedText);
          break;
        }
      }

      history.push(url);
    }
  }

  listener = (msg) => {
    const { type, payload } = msg;
    switch (msg.type) {
      case CHROME_MESSAGE.TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case CHROME_MESSAGE.TAB_UPDATE: {
        const { url } = payload;
        this.handleTabUpdate(url);
        break;
      }
      case CHROME_MESSAGE.SEARCH:
      case CHROME_MESSAGE.ASK:
      case CHROME_MESSAGE.CREATE: {
        this.handleContextMenuAction(type, payload.selectionText);
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
    const showFullDock = dockExpanded || (pathname !== '/ask' && pathname !== '/login');

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