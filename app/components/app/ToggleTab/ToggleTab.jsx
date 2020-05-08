import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

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
  toggleDock,
  hideToggleTab,
  history
}) => {
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
    <div className={s('toggle-tab')}>
      <Button
        color={color}
        icon={<MdClose />}
        className={s('toggle-tab-button toggle-close-button')}
        onClick={onCloseClick}
      />
      <Button
        color={color}
        icon={<img src={logo} className={s('w-3/4')} alt="Omni Logo" />}
        className={s('toggle-tab-button rounded-l-none')}
        onClick={onOpenClick}
      />
    </div>
  );
};

export default ToggleTab;
