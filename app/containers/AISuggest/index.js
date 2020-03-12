import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SuggestionScrollContainer from '../../components/suggestions/SuggestionScrollContainer';
import { requestSearchCards } from '../../actions/search';
import { SEARCH_TYPE } from '../../utils/constants';

import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn();

@connect(
  state => {
    const { cards, isSearchingCards, hasReachedLimit } = state.search.cards[SEARCH_TYPE.AI_SUGGEST];
    return { cards, isSearchingCards, hasReachedLimit };
  },
  dispatch =>
  bindActionCreators(
    {
      requestSearchCards,
    },
    dispatch
  )
)

class AISuggest extends Component {
  render() {
    const { isSearchingCards, cards, requestSearchCards, hasReachedLimit } = this.props;

    return (
      <SuggestionScrollContainer
        className={s('min-h-0 flex-1')}
        cards={cards}
        verticalMarginAdjust
        isSearchingCards={isSearchingCards}
        hasReachedLimit={hasReachedLimit}
        onBottom={() => requestSearchCards(SEARCH_TYPE.AI_SUGGEST)}
        getCardProps={(card, i) => ({
          className: i === 0 ? 'my-reg' : ''
        })}
      />
    );
  }
}

export default AISuggest;