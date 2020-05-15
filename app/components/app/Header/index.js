import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SEARCH } from 'appConstants';
import { openFinder } from 'actions/finder';
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

const mapDispatchToProps = {
  openFinder
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
