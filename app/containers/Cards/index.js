import { connect } from 'react-redux';
import {
  updateCardWindowPosition,
  updateCardTabOrder,
  closeCard,
  closeAllCards,
  setActiveCardIndex,
  adjustCardsDimensions,
  openCardModal,
  openCardContainerModal,
  closeCardContainerModal,
  toggleCards,
  toggleMaximizeCards,
  openCard
} from 'actions/cards';
import { openFinder } from 'actions/finder';
import trackEvent from 'actions/analytics';
import Cards from './Cards';

const mapStateToProps = (state) => {
  const {
    cards: {
      cards,
      showCards,
      cardsExpanded,
      cardsMaximized,
      activeCardIndex,
      activeCard,
      cardsWidth,
      cardsHeight,
      windowPosition,
      showCloseModal
    },
    profile: { user }
  } = state;

  return {
    user,
    cardsExpanded,
    cardsMaximized,
    showCards,
    cards,
    activeCardIndex,
    activeCard,
    cardsWidth,
    cardsHeight,
    windowPosition,
    showCloseModal
  };
};

const mapDispatchToProps = {
  openCard,
  openFinder,
  closeCard,
  closeAllCards,
  toggleMaximizeCards,
  toggleCards,
  setActiveCardIndex,
  updateCardWindowPosition,
  adjustCardsDimensions,
  updateCardTabOrder,
  openCardModal,
  openCardContainerModal,
  closeCardContainerModal,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
