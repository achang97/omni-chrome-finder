import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import _ from 'underscore';

import { MdClose } from "react-icons/md";
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex } from '../../actions/display'

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import style from './cards.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const defaultCardHeight = 500;
const defaultCardWidth = 660;

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

  renderTabHeader = () => {
    const { cards, activeCardIndex, setActiveCardIndex, closeAllCards } = this.props;

    return (
      <div id="card-tab-container" className={s("flex items-center bg-white rounded-t-lg px-reg pt-reg")}>
        <Tabs
          activeIndex={activeCardIndex}
          className={s("flex-1")}
          tabClassName={s("rounded-t-lg rounded-b-0 text-xs font-medium flex items-center")}
          activeTabClassName={s("bg-purple-light")}
          onTabClick={setActiveCardIndex}
          showRipple={false}
        >
          { cards.map(({ id }) => (
            <Tab key={id}>
              <div> {id} </div>
              <div onClick={(e) => this.closeCard(e, id)}>
                <MdClose />
              </div>
            </Tab>
          ))}
        </Tabs>
        <div className={s("px-reg")}>
          <button onClick={() => closeAllCards()}>
            <MdClose />
          </button>
        </div>
      </div>
    );
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
          defaultPosition={{ x: window.innerWidth / 2 - defaultCardWidth / 2, y: window.innerHeight / 2 - defaultCardHeight / 2 }}
        >
          <Resizable
            className={s("card bg-white rounded-lg shadow-2xl")}
            defaultSize={{ width: defaultCardWidth, height: defaultCardHeight }}
            minWidth={defaultCardWidth}
            minHeight={defaultCardHeight}
            enable={{top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
          >
            { this.renderTabHeader() }
            <CardContent {...cards[activeCardIndex]} />
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
