import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import { requestSearchCards } from 'actions/search';
import * as createActions from 'actions/create';
import Create from './Create';

const mapStateToProps = state => {
  const { 
    create,
    profile: {
      user
    }
  } = state;

  return { ...create, user };
}

const mapDispatchToProps = {
  openCard,
  requestSearchCards,
  ...createActions,  
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
