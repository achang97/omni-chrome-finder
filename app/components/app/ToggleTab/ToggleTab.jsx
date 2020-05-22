import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import ReactDraggable from 'react-draggable';

import { Button } from 'components/common';
import { ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

import logo from 'assets/images/logos/logo-light-icon.svg';
import style from './toggle-tab.css';

const s = getStyleApplicationFn(style);

const ToggleTab = ({
  dockVisible,
  toggleTabShown,
  autofindShown,
  toggleAutofindTab,
  numCards,
  toggleTabY,
  toggleDock,
  hideToggleTab,
  updateToggleTabPosition,
  history
}) => {
  const [isHovering, setHovering] = useState(false);

  const onOpenClick = () => {
    if (numCards > 0) {
      history.push(ROUTES.SUGGEST);
    }

    toggleDock();
  };

  const onCloseClick = () => {
    hideToggleTab();
    if (autofindShown) toggleAutofindTab();
  };

  const showAutofind = autofindShown && numCards !== 0;
  if (dockVisible || (!toggleTabShown && !showAutofind)) {
    return null;
  }

  const color = numCards > 0 ? 'gold' : 'primary';
  return (
    <ReactDraggable
      bounds={{ left: 0, right: 0, top: 0 }}
      position={{ x: 0, y: toggleTabY }}
      handle="#toggle-drag-handle"
      onStop={(e, { y }) => updateToggleTabPosition(y)}
    >
      <div
        className={s('toggle-tab')}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className={s('flex relative')}>
          {isHovering && (
            <div className={s('toggle-close-button')} onClick={onCloseClick}>
              <MdClose />
            </div>
          )}
          <div id="toggle-drag-handle" className={s(`toggle-drag-handle ${color}-gradient`)}>
            ||
          </div>
          <Button
            color={color}
            icon={<img src={logo} className={s('w-3/4')} alt="Omni Logo" />}
            className={s('toggle-tab-button rounded-l-none')}
            onClick={onOpenClick}
          />
        </div>
      </div>
    </ReactDraggable>
  );
};

ToggleTab.propTypes = {
  // Redux State
  dockVisible: PropTypes.bool.isRequired,
  toggleTabShown: PropTypes.bool.isRequired,
  autofindShown: PropTypes.bool.isRequired,
  numCards: PropTypes.number.isRequired,
  toggleTabY: PropTypes.number.isRequired,

  // Redux Actions
  toggleAutofindTab: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  hideToggleTab: PropTypes.func.isRequired,
  updateToggleTabPosition: PropTypes.func.isRequired
};

export default ToggleTab;
