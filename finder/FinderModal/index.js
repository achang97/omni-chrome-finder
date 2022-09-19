import { connect } from 'react-redux';
import { closeFinder } from 'actions/finder';
import FinderModal from './FinderModal';

const mapDispatchToProps = {
  closeFinder
};

export default connect(undefined, mapDispatchToProps)(FinderModal);
