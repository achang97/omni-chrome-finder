import { connect } from 'react-redux';
import { openCardModal, closeCardModal } from 'actions/cards';
import CardLocation from './CardLocation';

const mapStateToProps = (state) => {
  const {

  } = state;

  return { };
};

const mapDispatchToProps = {
  openCardModal,
  closeCardModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLocation);
