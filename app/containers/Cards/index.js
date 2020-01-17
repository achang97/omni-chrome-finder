import React, { Component } from 'react';
import style from './cards.css';
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import _ from 'underscore';

import CloseIcon from '@material-ui/icons/Close';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CheckIcon from '@material-ui/icons/Check';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { Button } from '@material-ui/core';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard } from '../../actions/display'

@connect(
  state => ({
    cards: state.display.cards,
  }),
  dispatch => bindActionCreators({
    closeCard
  }, dispatch)
)

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positions: {},
    }
  }

  componentDidMount() {
    const { cards } = this.props;

    const newPositions = {};
    cards.forEach(card => {
      newPositions[card] = null;
    });

    this.setState({ positions: newPositions });
  }

  componentDidUpdate(prevProps) {
    const { cards: prevCards } = prevProps;
    const { cards } = this.props;
    const { positions } = this.state;

    if (prevCards.length < cards.length) { // Added card
      const newCard = cards[cards.length - 1];
      const newPositions = { ...positions, [newCard]: null };
      this.setState({ positions: newPositions });
    } else if (prevCards.length > cards.length) { // Closed card
      const closedCard = _.difference(prevCards, cards)[0];
      const newPositions = _.omit(positions, closedCard);
      this.setState({ positions: newPositions });
    }
  }

  handleDrag = (card, ui) => {
    const { positions } = this.state;
    const { x, y } = positions[card] || { x: 0, y: 0 };

    const newPositions = _.clone(positions);
    newPositions[card] = { x: ui.x, y: ui.y }

    this.setState({ positions: newPositions });
  };

  render() {
    const { cards, closeCard } = this.props;
    const { positions } = this.state;

    return (
      <div>
        <style type="text/css">{style}</style>
        
        { cards.map(card => (
          <Draggable
            bounds="html"
            handle="strong"
            // positionOffset={{x: '20%', y: '20%'}}
            position={positions[card]}
            onDrag={(e, ui) => this.handleDrag(card, ui)}
          >
            <Resizable className="card white-background"
              defaultSize={{
                width:500,
                height:500,
              }} minWidth={500} minHeight={500}
              enable={ {top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false} } >
              <div className="card-top-section">
                <strong className="card-header padder-horizontal-lg padder-top-lg padder-bottom-md flex-row-centered flex-justify-space-between">
                  <div>2 Days Ago</div>
                  <div className="flex-row-centered">
                    <MoreHorizIcon />
                    <div onClick={() => closeCard(card)}>
                      <CloseIcon />
                    </div>
                  </div>
                </strong>
                <div className="padder-horizontal-lg padder-bottom-lg">
                  <div className="card-title">How do I delete a user?</div>
                  <div className="margin-vertical-lg">Here is the answer on how to do that. This should eventually be in a rich text editor, but we'll deal with that later. </div>
                  <div className="flex-row-centered flex-justify-space-between">
                    <div className="flex-row-centered">
                      <div className="flex-row-centered padder-sm card-tag-container margin-right-sm">
                        <div className="margin-right-sm">Customer Request Actions</div>
                      </div> 
                      <div className="flex-row-centered padder-sm card-tag-container">
                        <div className="margin-right-sm">Onboarding</div>
                      </div> 
                    </div>

                    <div className="card-flag-up-to-date flex-row-centered padder-sm"> 
                      <CheckIcon className="margin-right-sm" />
                      <div>Up To Date</div>
                      <ArrowDropDownIcon />
                    </div>
                  </div>
                </div>
              </div>



              <div className="card-bottom-panel full-width flex-row-centered flex-justify-space-between">
                <Button>
                  Edit Card
                </Button>
              </div>

            </Resizable>
          </Draggable>
          
        ))}
      </div>
    );
  }
}
