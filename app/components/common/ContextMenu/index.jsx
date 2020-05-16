import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';
import contextMenuStyle from './context-menu.css';

import Separator from '../Separator';

const s = getStyleApplicationFn(contextMenuStyle);

const ContextMenu = ({ options, outerClassName, className, optionClassName, style, isRight }) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className={s(`context-menu ${outerClassName} ${className}`)} style={style}>
      {options.map(({ label, onClick, disabled, options: nestedOptions = [] }, i) => (
        <React.Fragment key={label}>
          <div
            className={s(
              `context-menu-option ${optionClassName} ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`
            )}
            onClick={() => onClick && !disabled && onClick()}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {label}
            {nestedOptions.length !== 0 && <MdChevronRight className={s('text-purple-reg')} />}
            {hoverIndex === i && (
              <ContextMenu
                options={nestedOptions}
                className={className}
                optionClassName={optionClassName}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: !isRight ? 'auto' : '100%',
                  right: isRight ? 'auto' : '100%'
                }}
              />
            )}
          </div>
          {i !== options.length - 1 && <Separator horizontal className={s('my-0')} />}
        </React.Fragment>
      ))}
    </div>
  );
};

ContextMenu.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.object)
    })
  ).isRequired,
  isRight: PropTypes.bool,
  className: PropTypes.string,
  optionClassName: PropTypes.string,
  outerClassName: PropTypes.string,
  style: PropTypes.shape({})
};

ContextMenu.defaultProps = {
  isRight: true,
  style: {},
  className: '',
  outerClassName: '',
  optionClassName: ''
};

export default ContextMenu;
