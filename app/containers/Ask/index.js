import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { openCard } from '../../actions/display';

@connect(
  state => ({
  }),
  dispatch => bindActionCreators({
  	openCard,
  }, dispatch)
)

export default class Ask extends Component {
  openCard() {
  	this.props.openCard(Math.random());
  }

  render() {
    return (
      <div>
        Ask Body
        <button onClick={() => this.openCard()}> Open Card </button>
      </div>
    );
  }
}
