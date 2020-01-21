import React, { Component } from 'react';
import style from './cards.css';
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import _ from 'underscore';

import CloseIcon from '@material-ui/icons/Close';
import { Button, Tabs, Tab } from '@material-ui/core';
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex } from '../../actions/display'

const defaultCardSize = 500;

@connect(
  state => ({
    cards: state.display.cards,
    activeCardIndex: state.display.activeCardIndex,
  }),
  dispatch => bindActionCreators({
    closeCard,
    closeAllCards,
    setActiveCardIndex,
  }, dispatch)
)

export default class Cards extends Component {
  constructor(props) {
    super(props);
  }

  closeCard = (e, cardId) => {
    const { closeCard } = this.props;

    e.stopPropagation();
    closeCard(cardId);
  }

  render() {
    const { cards, closeCard, closeAllCards, activeCardIndex, setActiveCardIndex } = this.props;

    if (cards.length === 0) {
      return null;
    }

    return (
      <div>
        <style type="text/css">{style}</style>
        <Draggable
          bounds="html"
          handle="#card-tab-container"
          defaultPosition={{ x: window.innerWidth / 2 - defaultCardSize / 2, y: window.innerHeight / 2 - defaultCardSize / 2 }}
        >
          <Resizable
            className="card white-background"
            defaultSize={{ width: defaultCardSize, height: defaultCardSize }}
            minWidth={defaultCardSize}
            minHeight={defaultCardSize}
            enable={{top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
          >
            <div className="flex-row-centered card-header">
              <Tabs
                id="card-tab-container"
                className="stretch"
                value={activeCardIndex}
                onChange={(e, newIndex) => setActiveCardIndex(newIndex)}
                variant="scrollable"
              >
                { cards.map(cardId => (
                  <Tab
                    key={cardId}
                    className="card-tab"
                    label={
                      <div className="flex-row-centered flex-justify-space-between"> 
                        <div> {cardId} </div>
                        <Button onClick={(e) => this.closeCard(e, cardId)}>
                          <CloseIcon />
                        </Button>
                      </div>
                    }
                  />
                ))}
              </Tabs>
              <div className="flex-row-centered flex-justify-end">
                <Button onClick={() => closeAllCards()}>
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <CardContent id={cards[activeCardIndex]} />
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
