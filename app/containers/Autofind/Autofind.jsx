import React from 'react';
import PropTypes from 'prop-types';
import SuggestionScrollContainer from 'components/suggestions/SuggestionScrollContainer';
import { SEARCH, AUDIT } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Autofind = ({
  isSearchingCards,
  cards,
  searchLogId,
  hasReachedLimit,
  requestSearchCards
}) => (
  <SuggestionScrollContainer
    className={s('min-h-0 flex-1')}
    cards={cards}
    verticalMarginAdjust
    searchLogId={searchLogId}
    source={AUDIT.SOURCE.AUTOFIND}
    isSearchingCards={isSearchingCards}
    hasReachedLimit={hasReachedLimit}
    onBottom={() => requestSearchCards(SEARCH.SOURCE.AUTOFIND)}
    getCardProps={(card, i) => ({
      className: i === 0 ? 'my-reg' : ''
    })}
  />
);

Autofind.propTypes = {
  // Redux State
  isSearchingCards: PropTypes.bool,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasReachedLimit: PropTypes.bool.isRequired,
  searchLogId: PropTypes.string.isRequired,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired
};

Autofind.defaultProps = {
  isSearchingCards: false
};

export default Autofind;
