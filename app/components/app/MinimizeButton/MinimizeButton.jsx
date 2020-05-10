import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const MinimizeButton = ({ minimizeDock }) => {
  const onClick = (e) => {
    e.stopPropagation();
    minimizeDock();
  };

  return (
    <button className={s('absolute z-10 top-0 left-0 ml-sm mt-xs')} onClick={onClick}>
      <MdClose className={s('text-purple-gray-50 text-sm hover:text-purple-reg')} />
    </button>
  );
};

MinimizeButton.propTypes = {
  // Redux Actions
  minimizeDock: PropTypes.func.isRequired
};

export default MinimizeButton;
