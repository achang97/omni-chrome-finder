import { connect } from 'react-redux';
import CardAttachment from './CardAttachment';

const mapStateToProps = state => {
  const { 
    auth: { token }
  } = state;

  return { token };
}

export default connect(mapStateToProps)(CardAttachment);
