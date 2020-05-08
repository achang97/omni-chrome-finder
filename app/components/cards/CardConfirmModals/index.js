import { connect } from 'react-redux';
import * as cardActions from 'actions/cards';
import CardConfirmModals from './CardConfirmModals';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard, activeCardIndex }
  } = state;

  return { ...activeCard, activeCardIndex };
};

const mapDispatchToProps = {
  ...cardActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);
