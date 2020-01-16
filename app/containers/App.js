import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import style from './App.css';
import globalStyle from '../styles/global.css';
import Dock from 'react-dock';
import { combineStyles } from '../utils/style';
import { TOGGLE, TAB_UPDATE } from '../utils/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../actions/display'

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';
import Cards from './Cards';

@connect(
  state => ({
    dockVisible: state.display.dockVisible,
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestTabVisible: false,
    };

    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);

    window.onload = () => {
      this.handleTabUpdate(window.location.href);
    }
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
  }

  getPageText() {
    // TODO: Basic version that is website agnostic, simply removes chrome extension code from DOM
    // and gets inner text. Future version should look at specific divs (ie. title and content of email for Gmail).
    
    // const allDivs = document.body.querySelectorAll("*:not(#omni-chrome-ext-main-container)");
    // let pageText = '';
    // allDivs.forEach(div => pageText += `${div.innerText}\n`);
    // return pageText;
  }

  handleTabUpdate(url) {
    // Placeholder code for AI Suggest, code should be written in another file eventually
    // Case 1: Matches 
    if (/https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\/.+/.test(url)) {
      this.setState({ suggestTabVisible: true });
      // const text = this.getPageText();
      // console.log(text)
    } else {
      this.setState({ suggestTabVisible: false });
    }
  }

  listener(msg) {
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
    const { dockVisible, toggleDock } = this.props;
    const { suggestTabVisible } = this.state;

    return (
      <div className={style.container}>
        { dockVisible && <Cards /> }
        { suggestTabVisible && // TODO: move to new file and style
          <div className={combineStyles(style['suggest-tab'], globalStyle['white-background'])} onClick={() => toggleDock()}>
            AI Suggest
          </div>
        }
        <Dock
          position="right"
          fluid={false}
          dimMode="none"
          size={300}
          isVisible={dockVisible}
        >
          <Header />
          <Switch>
            <Route path="/ask" component={Ask} />
            <Route path="/create" component={Create} />
            <Route path="/navigate" component={Navigate} />
            <Route path="/tasks" component={Tasks} />
            {/* A catch-all route: put all other routes ABOVE here */}
            <Redirect to='/ask' />
          </Switch>
        </Dock>
      </div>
    );
  }
}
