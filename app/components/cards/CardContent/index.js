import { connect } from 'react-redux';
import * as cardActions from 'actions/cards';
import CardContent from './CardContent';

const mapStateToProps = state =>{
  const {
    profile: {
      user
    },
    cards: {
      activeCard,
      cardsHeight,
      cardsWidth,
      activeCardIndex
    }
  } = state;

  return { user, ...activeCard, cardsHeight, cardsWidth, activeCardIndex };
}

const mapDispatchToProps = {
  ...cardActions
}

export default connect(mapStateToProps, mapDispatchToProps)(CardContent);
