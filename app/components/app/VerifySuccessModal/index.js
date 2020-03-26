import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn();

@connect(
  state => ({
    verifySuccess: state.auth.verifySuccess,
    userFirstName: state.profile.user.firstname,
  }),
  dispatch =>
    bindActionCreators(
      {
      },
      dispatch
    )
)

class VerifySuccessModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVerifySuccessModal: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.verifySuccess && this.props.verifySuccess) {
      this.toggleVerifySuccessModal();
    }
  }

  toggleVerifySuccessModal = () => {
    this.setState({ showVerifySuccessModal: !this.state.showVerifySuccessModal });
  } 

  render() {
    const { showVerifySuccessModal } = this.state;
    const { userFirstName } = this.props;

    return (
      <Modal
        isOpen={showVerifySuccessModal}
        onRequestClose={this.toggleVerifySuccessModal}
        showHeader={false}
        shouldCloseOnOutsideClick
        overlayClassName={s('rounded-b-lg')}
        bodyClassName={s('rounded-b-lg flex flex-col')}
      >
        <div className={s('p-xl')}>
          <div> We've successfully verified your account, <span className={s('font-semibold')}> {userFirstName}. </span> </div>
          <div className={s('mt-lg text-center')}> 🎉 Welcome to Omni! 🎉  </div>
        </div>
        <Button
          text="Let's go!"
          onClick={this.toggleVerifySuccessModal}
          className={s('flex-shrink-0 rounded-t-none')}
          underline
          underlineColor="purple-gray-50"
          color="primary"
        />
      </Modal>
    )
  }
}

export default VerifySuccessModal;
