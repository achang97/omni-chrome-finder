import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dock from 'react-dock';
import { TOGGLE, TAB_UPDATE } from '../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../actions/display';

import Header from '../components/common/Header';
import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';
import Cards from './Cards';
import Profile from './Profile';

import style from './App.css';
import { getStyleApplicationFn } from '../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const dockPanelStyles = {
  background: 'white',
  borderRadius: '6px 0 0 6px',
};

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
    dockExpanded: state.display.dockExpanded,
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestTabVisible: false,
    };
  }

  componentDidMount() {
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
  }

  handleFirstPageLoad = () => {
    this.handleTabUpdate(window.location.href);
  }

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
  }

  listener = (msg) => {
    const { type, ...restMsg } = msg;
    switch (msg.type) {
      case TOGGLE: {
        this.props.toggleDock();
        break;
      }
      case TAB_UPDATE: {
        const { url } = restMsg;
        this.handleTabUpdate(url);
        break;
      }
    }
  }

  render() {
    const { dockVisible, dockExpanded, toggleDock, location: { pathname } } = this.props;
    const { suggestTabVisible, jss } = this.state;

    // Solution to CSS isolation taken from https://stackoverflow.com/a/57221293.
    return (
      <div className={s('app-container')}>
        { dockVisible && <Cards /> }
        { suggestTabVisible && // TODO: move to new file and style
          <div className={s('app-suggest-tab fixed bg-white shadow-md')} onClick={() => toggleDock()}>
            AI Suggest
          </div>
        }
        <Dock
          position="right"
          fluid={false}
          dimMode="none"
          size={350}
          isVisible={dockVisible}
          dockStyle={{ height: (dockExpanded || pathname !== '/ask') ? '100%' : 'auto', ...dockPanelStyles }}
        >
          <Header />
          <Switch>
            <Route path="/ask" component={Ask} />
            <Route path="/create" component={Create} />
            <Route path="/navigate" component={Navigate} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/profile" component={Profile} />
            {/* A catch-all route: put all other routes ABOVE here */}
            <Redirect to="/ask" />
          </Switch>
        </Dock>
      </div>
    );
  }
}

export default withRouter(App);
