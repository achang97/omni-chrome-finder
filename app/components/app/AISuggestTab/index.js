import React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdLightbulbOutline } from 'react-icons/md';

import Button from '../../../components/common/Button';
import { toggleDock } from '../../../actions/display';
import style from './ai-suggest-tab.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const AISuggestTab = ({ toggleDock, history }) => {
  const onClick = () => {
    toggleDock();
    history.push('/suggest');
  };

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
  }),
  dispatch => bindActionCreators({
    toggleDock,
  }, dispatch)
)(withRouter(AISuggestTab));
