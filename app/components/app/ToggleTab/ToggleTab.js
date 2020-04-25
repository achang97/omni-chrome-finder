import React from 'react';
import PropTypes from 'prop-types';
import { MdLightbulbOutline, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { Button } from 'components/common';
import { ROUTES } from 'appConstants';

import style from './toggle-tab.css';
import { getStyleApplicationFn } from 'utils/style';

import logo from 'assets/images/logos/logo-light-icon.svg';

const s = getStyleApplicationFn(style);

const ToggleTab = ({ toggleDock, history, numCards, showToggleTab }) => {
  const onClick = () => {
    if (numCards > 0) {
      history.push(ROUTES.SUGGEST);
    }

    toggleDock();
  };

  if (!showToggleTab && numCards === 0) {
    return null;
  }

  return (
    <Button
      color={numCards > 0 ? 'gold' : 'primary'}
      icon={<img src={logo} className={s('w-3/4')} />}
      className={s('toggle-tab')}
      onClick={onClick}
    />
  );
};

export default ToggleTab;