import { connect } from 'react-redux';
import PlaceholderImg from './PlaceholderImg';

const mapStateToProps = (state) => {
  const {
    auth: { token }
  } = state;

  return { token };
};

export default connect(mapStateToProps)(PlaceholderImg);
