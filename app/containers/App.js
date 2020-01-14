import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import style from './App.css';
import globalStyle from '../styles/global.css';
import Draggable from 'react-draggable';
import Dock from 'react-dock';
import shadow from 'react-shadow';
import { combineStyles } from '../utils/style';

import CloseIcon from '@material-ui/icons/Close';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock, closeCard } from '../actions/display'

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';

@connect(
  state => ({
    cards: state.display.cards,
    dockVisible: state.display.dockVisible,
  }),
  dispatch => bindActionCreators({
    toggleDock,
    closeCard
  }, dispatch)
)

export default class App extends Component {
  constructor(props) {
    super(props);

    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener(this.listener);
    this.props.toggleDock();
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
    const { dockVisible, cards, closeCard } = this.props;
    return (
      <div className={style.container}>
        { dockVisible && /// TODO: Needs to be updated by making Draggable component controlled
          cards.map(card => (
          <Draggable
            bounds="html"
          >
            <div className={combineStyles(style.card, globalStyle['padder-lg'], globalStyle['white-background'])}>
              <button onClick={() => closeCard(card)}>
                <CloseIcon />
              </button>
              <div> Card ID: {card} </div>
            </div>
          </Draggable>
        ))
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
