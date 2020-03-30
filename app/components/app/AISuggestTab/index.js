import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdLightbulbOutline, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import Button from '../../../components/common/Button';
import { SEARCH_TYPE, ROUTES } from '../../../utils/constants';
import { toggleDock } from '../../../actions/display';
import style from './ai-suggest-tab.css';
import { getStyleApplicationFn } from '../../../utils/style';

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

export default connect(
  state => ({
    numCards: state.search.cards[SEARCH_TYPE.AI_SUGGEST].cards.length,
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)(withRouter(AISuggestTab));
