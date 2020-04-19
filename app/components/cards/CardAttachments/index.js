import { connect } from 'react-redux';
import CardAttachments from './CardAttachments';

const mapStateToProps = state => {
  const {
    auth: {
      token
    }
  } = state;

  return { token };
}

export default connect(mapStateToProps)(CardAttachments);