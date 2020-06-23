import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import sharedStyle from '../styles/external-result.css';

const s = getStyleApplicationFn(sharedStyle);

const ExternalResultHeader = ({ logo, title, numItems, headerEnd }) => {
  return (
    <div className={s('flex items-center justify-between px-reg pt-xs pb-sm mb-xs')}>
      <div className={s('flex items-center text-sm text-gray-dark')}>
        <div className={s('external-result-icon mr-sm')}>
          <img src={logo} alt={title} />
        </div>
        <span className={s('font-semibold mr-sm')}> {title} </span>
        {numItems && <span> ({numItems}) </span>}
      </div>
      {headerEnd}
    </div>
  );
};

ExternalResultHeader.propTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  numItems: PropTypes.number,
  headerEnd: PropTypes.node
};

export default ExternalResultHeader;
