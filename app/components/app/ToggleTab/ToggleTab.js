import React from 'react';
import PropTypes from 'prop-types';
import { MdLightbulbOutline, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdClose } from 'react-icons/md';

import { Button } from 'components/common';
import { ROUTES } from 'appConstants';

import style from './toggle-tab.css';
import { getStyleApplicationFn } from 'utils/style';

import logo from 'assets/images/logos/logo-light-icon.svg';

const s = getStyleApplicationFn(style);

const ToggleTab = ({
  toggleTabShown, history,
  numCards, toggleDock, hideToggleTab,
}) => {
  const onOpenClick = () => {
    if (numCards > 0) {
      history.push(ROUTES.SUGGEST);
    }

    toggleDock();
  };

  if (!toggleTabShown && numCards === 0) {
    return null;
  }

  const color = numCards > 0 ? 'gold' : 'primary';

  return (
    <div className={s('toggle-tab')}>
      <Button
        color={color}
        icon={<MdClose />}
        className={s('toggle-tab-button toggle-close-button')}
        onClick={hideToggleTab}
      />      
      <Button
        color={color}
        icon={<img src={logo} className={s('w-3/4')} />}
        className={s('toggle-tab-button rounded-l-none')}
        onClick={onOpenClick}
      />
    </div>
  );
};

export default ToggleTab;