import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import _ from 'underscore';

import { MdClose, MdMoreHoriz } from "react-icons/md";
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex } from '../../actions/display';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import { colors } from '../../styles/colors';
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
    this.state = {
      cardsWidth: defaultCardWidth,
      cardsHeight: defaultCardHeight,
    }
  }

  closeCard = (e, cardId) => {
    const { closeCard } = this.props;

    e.stopPropagation();
    closeCard(cardId);
  }

  renderTabHeaderButtons = () => {
    const { closeAllCards } = this.props;

    return (
      <div className={s("px-reg flex flex-shrink-0")}>
        <button onClick={() => closeAllCards()}>
          <MdClose color={colors.purple['gray-50']} />
        </button>
      </div>
    );
  }

  renderTabHeader = () => {
    const { cards, activeCardIndex, setActiveCardIndex, closeAllCards } = this.props;

    return (
      <div id="card-tab-container" className={s("flex flex-shrink-0 min-h-0 items-center bg-white rounded-t-lg px-reg pt-reg")}>
        <Tabs
          activeIndex={activeCardIndex}
          className={s("flex-1")}
          tabClassName={s("card-tab pr-0 rounded-t-lg rounded-b-0 text-xs font-medium flex items-center justify-between")}
          activeTabClassName={s("bg-purple-light")}
          onTabClick={setActiveCardIndex}
          showRipple={false}
          scrollButtonColor={colors.purple['gray-50']}
        >
          {cards.map(({ id }, i) => (
            <Tab key={id}>
              <div className={s("truncate")}> How do I delete a user? ({id}) </div>
              <div className={s("flex ml-xs")}>
                <div onClick={(e) => this.closeCard(e, id)} className={s("mr-reg")}>
                  <MdClose color={colors.purple['gray-50']}/>
                </div>
                { (i !== activeCardIndex && i !== activeCardIndex - 1) &&
                  <div className={s("text-purple-gray-50")}> | </div>
                }
              </div>
            </Tab>
          ))}
        </Tabs>
        {this.renderTabHeaderButtons()}
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
            className={s("card bg-white rounded-lg shadow-2xl flex flex-col")}
            defaultSize={{ width: defaultCardWidth, height: defaultCardHeight }}
            size={{ width: this.state.cardsWidth, height: this.state.cardsHeight }}
            onResizeStop={(e, direction, ref, d) => {
              this.setState({
                cardsWidth: this.state.cardsWidth + d.width,
                cardsHeight: this.state.cardsHeight + d.height,
              });
            }}
            minWidth={defaultCardWidth}
            minHeight={defaultCardHeight}
            enable={{ top: false, right: true, bottom: true, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
          >
            { this.renderTabHeader() }
            <CardContent {...cards[activeCardIndex]} cardWidth={this.state.cardsWidth} cardHeight={this.state.cardsHeight} tags={['Customer Onboarding', 'Sales']}/>
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
