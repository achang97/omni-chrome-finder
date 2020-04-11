import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdLightbulbOutline, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { Button } from 'components/common';
import { ROUTES } from 'appConstants';

import style from './ai-suggest-tab.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const AISuggestTab = ({ toggleDock, history, numCards }) => {
  const [isExpanded, toggleExpanded] = useState(true);

  const onClick = () => {
    toggleDock();
    history.push(ROUTES.SUGGEST);
  };

  if (numCards === 0) {
    return null;
  }

  return (
    <div className={s(`flex ai-suggest-tab ${isExpanded ? 'slide-in' : 'slide-out'}`)}>
      <Button
        color="gold"
        icon={isExpanded ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        className={s('ai-suggest-expand-button')}
        onClick={() => toggleExpanded(!isExpanded)}
      />
      <Button
        color="gold"
        className={s('opacity-100 rounded-none')}
        onClick={onClick}
        icon={<MdLightbulbOutline className={s('mr-sm')} />}
        text="Suggestions available"
      />
    </div>
  );
};

export default AISuggestTab;