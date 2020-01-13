import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import * as TodoActions from '../actions/todos';
import style from './App.css';

import Ask from './Ask';
import Create from './Create';
import Navigate from './Navigate';
import Tasks from './Tasks';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {
  render() {
    const { todos, actions } = this.props;

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
