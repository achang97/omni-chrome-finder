import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SEARCH } from 'appConstants';
import Header from './Header';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    search: {
      cards: {
        [SEARCH.TYPE.AI_SUGGEST]: {
          cards
        }
      }
    },
    tasks: { tasks }
  } = state;

  return {
    user,
    numAISuggestCards: cards.length,
    numTasks: tasks.filter(({ resolved }) => !resolved).length
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

