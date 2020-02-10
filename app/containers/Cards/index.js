import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import _ from 'underscore';

import { MdClose, MdMoreHoriz } from "react-icons/md";
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex, adjustCardsDimensions } from '../../actions/cards';

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import { colors } from '../../styles/colors';
import style from './cards.css';
import { DEBOUNCE_60_HZ, CARD_DIMENSIONS } from '../../utils/constants';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    cards: state.cards.cards,
    activeCardIndex: state.cards.activeCardIndex,
    activeCard: state.cards.activeCard,
    cardsWidth: state.cards.cardsWidth,
    cardsHeight: state.cards.cardsHeight,
  }),
  dispatch => bindActionCreators({
    closeCard,
    closeAllCards,
    setActiveCardIndex,
    adjustCardsDimensions,
  }, dispatch)
)

export default class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  closeCard = (e, index) => {
    const { closeCard } = this.props;

    e.stopPropagation();
    closeCard(index);
  }

  renderTabHeaderButtons = () => {
    const { closeAllCards } = this.props;

    return (
      <div className={s("px-reg flex flex-shrink-0")}>
        <button onClick={closeAllCards}>
          <MdClose color={colors.purple['gray-50']} />
        </button>
      </div>
    );
  }

  updateTab = (tabValue) => {
    const { setActiveCardIndex } = this.props;
    setActiveCardIndex(tabValue);
  }

  renderTabHeader = () => {
    const { cards, activeCardIndex, activeCard, setActiveCardIndex, closeAllCards } = this.props;

    return (
      <div
        id="card-tab-container"
        className={s("card-tab-container")}
        style={{ height: CARD_DIMENSIONS.TABS_HEIGHT }}
      >
        <Tabs
          activeValue={activeCardIndex}
          className={s("flex-1")}
          tabClassName={s("card-tab pr-0 rounded-t-lg rounded-b-0 text-xs font-medium flex items-center justify-between")}
          activeTabClassName={s("bg-purple-light")}
          onTabClick={this.updateTab}
          showRipple={false}
          scrollButtonColor={colors.purple['gray-50']}
        >
          {cards.map((card, i) => {
            if (i === activeCardIndex) {
              card = activeCard;
            }

            const { isEditing, question, edits, id } = card;
            return (
              <Tab key={id}>
                <div className={s("truncate")}> { (!isEditing ? question : edits.question ) || 'Untitled' } </div>
                <div className={s("flex ml-xs")}>
                  <div onClick={(e) => this.closeCard(e, i)} className={s("mr-reg")}>
                    <MdClose color={colors.purple['gray-50']}/>
                  </div>
                  { (i !== activeCardIndex && i !== activeCardIndex - 1) &&
                    <div className={s("text-purple-gray-50")}> | </div>
                  }
                </div>
              </Tab>
            );
          })}
        </Tabs>
        {this.renderTabHeaderButtons()}
      </div>
    );
  }

  onResize = (e, direction, ref, d) => {
    this.props.adjustCardsDimensions(ref.clientWidth, ref.clientHeight);
  }

  render() {
    const { cards, closeCard, closeAllCards, activeCardIndex, setActiveCardIndex, cardsWidth, cardsHeight } = this.props;

    if (cards.length === 0) {
      return null;
    }

    return (
      <div>
        <Draggable
          bounds="html"
          handle="#card-tab-container"
          defaultPosition={{ x: window.innerWidth / 2 - cardsWidth / 2, y: window.innerHeight / 2 - cardsHeight / 2 }}
        >
          <Resizable
            className={s("card bg-white rounded-lg shadow-2xl flex flex-col")}
            defaultSize={{ width: cardsWidth, height: cardsHeight }}
            size={{ width: cardsWidth, height: cardsHeight }}
            onResize={_.debounce(this.onResize, DEBOUNCE_60_HZ)}
            onResizeStop={this.onResize}
            minWidth={CARD_DIMENSIONS.DEFAULT_CARDS_WIDTH}
            minHeight={CARD_DIMENSIONS.DEFAULT_CARDS_HEIGHT}
            enable={{ top: false, right: true, bottom: true, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
          >
            { this.renderTabHeader() }
            <CardContent />
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
