import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdLightbulbOutline } from 'react-icons/md';

import Button from '../../../components/common/Button';
import { SEARCH_TYPE } from '../../../utils/constants';
import { toggleDock } from '../../../actions/display';
import style from './ai-suggest-tab.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const AISuggestTab = ({ toggleDock, history, numCards }) => {
  const onClick = () => {
    toggleDock();
    history.push('/suggest');
  };

  if (numCards === 0) {
    return null;
  }

  return (
    <Button
      color="gold"
      className={s('ai-suggest-tab')}
      onClick={onClick}
      icon={<MdLightbulbOutline className={s("mr-sm")} />}
      text="Suggestions available"
    />
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
