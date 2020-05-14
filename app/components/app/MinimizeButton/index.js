import { connect } from 'react-redux';
import { minimizeDock } from 'actions/display';
import MinimizeButton from './MinimizeButton';

const mapDispatchToProps = {
  minimizeDock
};

export default connect(undefined, mapDispatchToProps)(MinimizeButton);
