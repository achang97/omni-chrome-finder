import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import TextEditor from './TextEditor';

const mapStateToProps = (state) => {
  const {
    auth: { token },
    cards: { cardsHeight, cardsWidth, cardsMaximized }
  } = state;

  return { token, cardsHeight, cardsWidth, cardsMaximized };
};

const mapDispatchToProps = {
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
