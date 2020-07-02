import { connect } from 'react-redux';
import TextEditor from './TextEditor';

const mapStateToProps = (state) => {
  const {
    auth: { token }
  } = state;

  return { token };
};

export default connect(mapStateToProps)(TextEditor);
