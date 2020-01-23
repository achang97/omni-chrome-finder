import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import _ from 'underscore';

import { MdClose } from "react-icons/md";
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex } from '../../actions/display'

import style from './cards.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

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
        <Draggable
          bounds="html"
          handle="#card-tab-container"
          defaultPosition={{ x: window.innerWidth / 2 - defaultCardSize / 2, y: window.innerHeight / 2 - defaultCardSize / 2 }}
        >
          <Resizable
            className={s("card bg-white rounded-lg shadow-lg border border-solid border-grey-100")}
            defaultSize={{ width: defaultCardSize, height: defaultCardSize }}
            minWidth={defaultCardSize}
            minHeight={defaultCardSize}
            enable={{top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
          >
            <div className={s("card-header flex items-center bg-grey-100 rounded-t-lg")}>
              <div id="card-tab-container" className={s("flex-1")}>
                { cards.map((cardId, i) => (
                  <div
                    key={cardId}
                    className={s("card-tab bg-white shadow-md rounded flex items-center justify-between")}
                    onClick={() => setActiveCardIndex(i)}
                  > 
                    <div> {cardId} </div>
                    <button onClick={(e) => this.closeCard(e, cardId)}>
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
              <div className={s("flex items-center justify-end")}>
                <button onClick={() => closeAllCards()}>
                  <MdClose />
                </button>
              </div>
            </div>
            <CardContent id={cards[activeCardIndex]} />
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
