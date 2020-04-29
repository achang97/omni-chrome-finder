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

export default connect(mapStateToProps, undefined)(withRouter(Header));

