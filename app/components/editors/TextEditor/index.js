import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import TextEditor from './TextEditor';

const mapStateToProps = (state) => {
  const {
    auth: { token }
  } = state;

  return { token };
};

const mapDispatchToProps = {
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
