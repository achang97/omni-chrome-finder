import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from "re-resizable";
import _ from 'underscore';

import { MdClose, MdMoreHoriz } from "react-icons/md";
import CardContent from '../../components/cards/CardContent';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard, closeAllCards, setActiveCardIndex } from '../../actions/display'

import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';

import { colors } from '../../styles/colors';
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

  renderTabHeaderButtons = () => (
    <div className={s("px-reg flex flex-shrink-0")}>
      <button className={s("mr-sm")}>
        <MdMoreHoriz color={colors.purple['grey-50']} />
      </button>
      <button onClick={() => closeAllCards()}>
        <MdClose color={colors.purple['grey-50']} />
      </button>
    </div>
  )

  renderTabHeader = () => {
    const { cards, activeCardIndex, setActiveCardIndex, closeAllCards } = this.props;

    return (
      <div id="card-tab-container" className={s("flex items-center bg-white rounded-t-lg px-reg pt-reg")}>
        <Tabs
          activeIndex={activeCardIndex}
          className={s("flex-1")}
          tabClassName={s("card-tab pr-0 rounded-t-lg rounded-b-0 text-xs font-medium flex items-center justify-between")}
          activeTabClassName={s("bg-purple-light")}
          onTabClick={setActiveCardIndex}
          showRipple={false}
          scrollButtonColor={colors.purple['grey-50']}
        >
          { cards.map((cardId, i) => (
            <Tab key={cardId}>
              <div className={s("truncate")}> How do I delete a user? ({cardId}) </div>
              <div className={s("flex ml-xs")}>
                <div onClick={(e) => this.closeCard(e, cardId)} className={s("mr-reg")}>
                  <MdClose color={colors.purple['grey-50']}/>
                </div>
                { (i !== activeCardIndex && i !== activeCardIndex - 1) &&
                  <div className={s("text-purple-grey-50")}> | </div>
                }
              </div>
            </Tab>
          ))}
        </Tabs>
        { this.renderTabHeaderButtons() }
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
          defaultPosition={{ x: window.innerWidth / 2 - defaultCardSize / 2, y: window.innerHeight / 2 - defaultCardSize / 2 }}
        >
          <Resizable
            className={s("card bg-white rounded-lg shadow-2xl")}
            defaultSize={{ width: defaultCardSize, height: defaultCardSize }}
            minWidth={defaultCardSize}
            minHeight={defaultCardSize}
            enable={{top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false}}
          >
            { this.renderTabHeader() }
            <CardContent id={cards[activeCardIndex]} />
          </Resizable>
        </Draggable>
      </div>
    );
  }
}
