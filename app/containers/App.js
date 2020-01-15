import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import style from './App.css';
import globalStyle from '../styles/global.css';
import Dock from 'react-dock';
import { combineStyles } from '../utils/style';

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

    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.listener);
  }

  listener(msg, sender) {
    if(msg == "toggle"){
      this.props.toggleDock();
    }
  }

  render() {
    const { dockVisible } = this.props;
    return (
      <div className={style.container}>
        { dockVisible && <Cards /> }
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
