import { connect } from 'react-redux';
import { expandDock } from 'actions/display';
import { requestSearchCards } from 'actions/search';
import * as askActions from 'actions/ask';
import Ask from './Ask';

const mapStateToProps = state => {
  const { 
    ask,
    display: {
      dockExpanded
    },
    profile: {
      user
    },
    auth: {
      token
    }
  } = state;

  return { ...ask, dockExpanded, user, token };
}

const mapDispatchToProps = {
  ...askActions,
  expandDock,
  requestSearchCards, 
}

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
