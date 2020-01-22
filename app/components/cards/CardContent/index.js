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
			<div className="flex-col">
				<style type="text/css">{style}</style>
				<div className="bg-grey-xlight p-sm flex-1">
	        <strong className="px-lg pt-lg pb-sm flex items-center justify-between">
	          <div>2 Days Ago</div>
	          <div className="flex items-center">
	            <MoreHorizIcon />
	          </div>
	        </strong>
	        <div className="px-lg pb-lg">
	          <div className="text-2xl font-semibold">How do I delete a user? ({id}) </div>
	          <div className="my-lg">Here is the answer on how to do that. This should eventually be in a rich text editor, but we'll deal with that later. </div>
	          <div className="flex items-center justify-between">
	            <div className="flex items-center">
	            	{ ['Customer Request Actions', 'Onboarding'].map(tag => (
		              <div className="flex items-center p-xs mr-xs bg-grey-light text-purple-reg rounded-full font-semibold text-xs">
		                <div className="mr-xs">Customer Request Actions</div>
		              </div> 
	            	))}
	            </div>
	            <div className="flex items-center p-xs bg-green-xlight text-green-reg rounded-lg font-semibold text-xs"> 
	              <CheckIcon className="mr-xs" />
	              <div>Up To Date</div>
	              <ArrowDropDownIcon />
	            </div>
	          </div>
	        </div>
	      </div>
	      <div className="flex items-center justify-between fixed bottom-0 w-full bg-grey-light card-content-bottom-panel">
	        <Button>
	          Edit Card
	        </Button>
	      </div>
	    </div>
		);
	}
}