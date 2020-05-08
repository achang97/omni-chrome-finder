import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SEARCH } from 'appConstants';
import { minimizeDock } from 'actions/display';
import Header from './Header';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    search: {
      cards: {
        [SEARCH.TYPE.AUTOFIND]: { cards }
      }
    },
    tasks: { tasks }
  } = state;

  return {
    user,
    numAutofindCards: cards.length,
    numTasks: tasks.filter(({ resolved }) => !resolved).length
  };
};

export default connect(mapStateToProps, undefined)(withRouter(Header));
