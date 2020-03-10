import React from 'react';

import { MdLightbulbOutline } from 'react-icons/md';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDock } from '../../../actions/display';

import style from './ai-suggest-tab.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const AISuggestTab = ({ toggleDock }) => {
  return (
    <div
      className={s('ai-suggest-tab')}
      onClick={() => toggleDock()}
    >
      <MdLightbulbOutline className={s("text-purple-reg")} />
      <span className={s("ml-sm text-md")}> Suggestions available </span> 
    </div>
  );
}

export default  connect(
  state => ({
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)(AISuggestTab);