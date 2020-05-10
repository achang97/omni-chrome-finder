import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const BackButton = ({ onClick, className }) => (
  <button
    className={s(
      `bg-purple-light rounded-full w-2xl h-2xl flex justify-center items-center text-purple-reg ${className}`
    )}
    onClick={onClick}
    type="button"
  >
    <MdArrowBack />
  </button>
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

BackButton.defaultProps = {
  className: ''
};

export default BackButton;
