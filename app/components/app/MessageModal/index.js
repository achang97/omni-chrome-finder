import { connect } from 'react-redux';
import { closeModal } from 'actions/display';
import MessageModal from './MessageModal';

const mapStateToProps = (state) => {
  const {
    display: { modalOpen, modalProps }
  } = state;

  return { modalOpen, modalProps };
};

const mapDispatchToProps = {
  closeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal);
