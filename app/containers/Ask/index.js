import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import style from './ask.css';


import { openCard } from '../../actions/display';

@connect(
  state => ({
  }),
  dispatch => bindActionCreators({
  	openCard,
  }, dispatch)
)

export default class Ask extends Component {
	constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
    }

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event, tabValue) {
    this.setState({ tabValue });

    let path;
    switch (tabValue) {
      case 0:
        path = '/ask';
        break;
      case 1:
        path = '/create';
        break;
      case 2:
        path = '/navigate';
        break;
      default:
        return
    }

    //this.props.history.push(path);
  }

  openCard() {
  	this.props.openCard(Math.floor(Math.random() * Math.floor(10000)));
  }

  render() {
  	const { tabValue } = this.state;
    return (
      <div>
      	<style type="text/css">{style}</style>
      	<div className="padder-lg">
      		<Tabs value={tabValue} onChange={this.handleTabClick} TabIndicatorProps={{ style: { display: 'none', }}}>
            <Tab label="Slack" className="integrations-tab" />
            <Tab label="Email" className="integrations-tab" />
            <Tab label="Asana" className="integrations-tab" />
          </Tabs>
      		<TextField id="standard-basic" className="question-text-field" placeholder="Question" InputProps={{ disableUnderline: true}} fullWidth={true}/>
        	<div>Ask Body</div>
        	<button onClick={() => this.openCard()}> Open Card </button>
        </div>
      </div>
    );
  }
}
