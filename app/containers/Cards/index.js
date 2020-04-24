import { connect } from 'react-redux';
import {
  updateCardWindowPosition, updateCardTabOrder, closeCard, closeAllCards,
  setActiveCardIndex, adjustCardsDimensions, openCardModal, openCardContainerModal,
  closeCardContainerModal, toggleCards
} from 'actions/cards';
import Cards from './Cards';

const mapStateToProps = state => {
  const {
    cards: {
      cards,
      cardsExpanded,
      activeCardIndex,
      activeCard,
      cardsWidth,
      cardsHeight,
      windowPosition,
      showCloseModal
    }
  } = state;

  return { cardsExpanded, cards, activeCardIndex, activeCard, cardsWidth, cardsHeight, windowPosition, showCloseModal };
}

const mapDispatchToProps = {
  closeCard,
  closeAllCards,
  toggleCards,
  setActiveCardIndex,
  updateCardWindowPosition,
  adjustCardsDimensions,
  updateCardTabOrder,
  openCardModal,
  openCardContainerModal,
  closeCardContainerModal 
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards);