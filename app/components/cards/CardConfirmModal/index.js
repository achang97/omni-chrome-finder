import React from 'react';
import PropTypes from 'prop-types';

import { MODAL_TYPE } from '../../../utils/constants';

import Modal from '../../common/Modal';
import Button from '../../common/Button';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCardModal } from '../../../actions/cards';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const CardConfirmModal = ({ isOpen, title, description, body, error, onRequestClose, primaryButtonProps, secondaryButtonProps, showSecondary }) => {
  if (!secondaryButtonProps) {
    secondaryButtonProps = { text: "No", onClick: onRequestClose };
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      headerClassName={s("bg-purple-light")}
      overlayClassName={s("rounded-b-lg")}
      className={s("")}
      title={title}
      important
      >
      <div className={s("p-lg flex flex-col")}> 
        { description && <div> {description} </div> }
        { body }
        { error && <div className={s("error-text mt-xs")}> {error} </div> }
        <div className={s("flex mt-lg")} >
          { showSecondary &&
            <Button 
              color={"transparent"}
              className={s("flex-1 mr-reg")}
              underline
              {...secondaryButtonProps}
            /> 
          }
          <Button 
            color={"primary"}
            className={s(`flex-1 ${showSecondary ? 'ml-reg' : ''}`)}
            underline
            {...primaryButtonProps}
          />   
        </div>
      </div>
    </Modal>
  )
}

CardConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  body: PropTypes.element,
  error: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
  primaryButtonProps: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  secondaryButtonProps: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  showSecondary: PropTypes.bool,
}

CardConfirmModal.defaultProps = {
  showSecondary: true,
}

export default CardConfirmModal;