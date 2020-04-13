import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button, Message } from 'components/common';

import style from './card-confirm-modal.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const CardConfirmModal = ({
  isOpen, title, description, body, error,
  onRequestClose, primaryButtonProps, secondaryButtonProps, showPrimary,
  showSecondary, bodyClassName, ...rest
}) => {
  if (!secondaryButtonProps) {
    secondaryButtonProps = { text: 'No', onClick: onRequestClose };
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      headerClassName={s('bg-purple-light')}
      overlayClassName={s('rounded-b-lg')}
      title={title}
      important
      {...rest}
    >
      <div className={s(`card-confirm-modal-body ${bodyClassName}`)}>
        { description && <div> {description} </div> }
        { body }
        <Message className={s('mt-xs')} message={error} type="error" />
        { (showPrimary || showSecondary) &&
          <div className={s('flex mt-lg')} >
            { showSecondary &&
              <Button
                color={'transparent'}
                className={s('flex-1 mr-reg')}
                underline
                {...secondaryButtonProps}
              />
            }
            { showPrimary &&
              <Button
                color={'primary'}
                className={s(`flex-1 ${showSecondary ? 'ml-reg' : ''}`)}
                underline
                {...primaryButtonProps}
              />
            }
          </div>
        }
      </div>
    </Modal>
  );
};

CardConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  body: PropTypes.element,
  error: PropTypes.string,
  onRequestClose: PropTypes.func,
  primaryButtonProps: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func.isRequired,
  }).isRequired,
  secondaryButtonProps: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
  bodyClassName: PropTypes.string,
};

CardConfirmModal.defaultProps = {
  showPrimary: true,
  showSecondary: true,
  bodyClassName: '',
};

export default CardConfirmModal;
