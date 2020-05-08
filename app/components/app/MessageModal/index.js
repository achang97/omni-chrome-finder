import { connect } from 'react-redux';
import { openModal, closeModal } from 'actions/display';
import MessageModal from './MessageModal';

const mapStateToProps = (state) => {
  const {
    display: { modalOpen, modalProps }
  } = state;

  return { modalOpen, modalProps };
};

const mapDispatchToProps = {
  openModal,
  closeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal);
