import React from 'react';
import { connect } from 'react-redux';

import SuggestionScrollContainer from 'components/suggestions/SuggestionScrollContainer';
import { SEARCH } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Autofind = ({ isSearchingCards, cards, hasReachedLimit, requestSearchCards }) => (
  <SuggestionScrollContainer
    className={s('min-h-0 flex-1')}
    cards={cards}
    verticalMarginAdjust
    isSearchingCards={isSearchingCards}
    hasReachedLimit={hasReachedLimit}
    onBottom={() => requestSearchCards(SEARCH.TYPE.AUTOFIND)}
    getCardProps={(card, i) => ({
      className: i === 0 ? 'my-reg' : ''
    })}
  />
);

export default Autofind;
