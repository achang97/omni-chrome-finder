import React, { Component } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Button } from '@material-ui/core';

import style from './card-content.css';

export default class CardContent extends Component {
	render() {
		const { id } = this.props;
		return (
			<div>
				<style type="text/css">{style}</style>
				<div className="card-content-top-section">
	        <strong className="card-content-header padder-horizontal-lg padder-top-lg padder-bottom-md flex-row-centered flex-justify-space-between">
	          <div>2 Days Ago</div>
	          <div className="flex-row-centered">
	            <MoreHorizIcon />
	          </div>
	        </strong>
	        <div className="padder-horizontal-lg padder-bottom-lg">
	          <div className="card-content-title">How do I delete a user? ({id}) </div>
	          <div className="margin-vertical-lg">Here is the answer on how to do that. This should eventually be in a rich text editor, but we'll deal with that later. </div>
	          <div className="flex-row-centered flex-justify-space-between">
	            <div className="flex-row-centered">
	              <div className="flex-row-centered padder-sm card-content-tag-container margin-right-sm">
	                <div className="margin-right-sm">Customer Request Actions</div>
	              </div> 
	              <div className="flex-row-centered padder-sm card-content-tag-container">
	                <div className="margin-right-sm">Onboarding</div>
	              </div> 
	            </div>
	            <div className="card-content-flag-up-to-date flex-row-centered padder-sm"> 
	              <CheckIcon className="margin-right-sm" />
	              <div>Up To Date</div>
	              <ArrowDropDownIcon />
	            </div>
	          </div>
	        </div>
	      </div>
	      <div className="card-content-bottom-panel full-width flex-row-centered flex-justify-space-between">
	        <Button>
	          Edit Card
	        </Button>
	      </div>
	    </div>
		);
	}
}