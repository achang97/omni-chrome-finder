import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import style from './App.css';
import Draggable from 'react-draggable';

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';

@connect(
  state => ({
    cards: state.cards.cards,
  }),
  dispatch => bindActionCreators({
  }, dispatch)
)

export default class App extends Component {
  render() {
    const { cards } = this.props;
    return (
      <div className={style.container}>
        <Header />
        <Switch>
          <Route path="/ask" component={Ask} />
          <Route path="/create" component={Create} />
          <Route path="/navigate" component={Navigate} />
          <Route path="/tasks" component={Tasks} />
          {/* A catch-all route: put all other routes ABOVE here */}
          <Redirect to='/ask' />
        </Switch>
      </div>
    );
  }
}
