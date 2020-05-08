import { connect } from 'react-redux';
import { requestSearchTags } from 'actions/search';
import CardTags from './CardTags';

const mapStateToProps = (state) => {
  const {
    search: { tags, isSearchingTags }
  } = state;

  return { tagOptions: tags, isSearchingTags };
};

const mapDispatchToProps = {
  requestSearchTags
};

export default connect(mapStateToProps, mapDispatchToProps)(CardTags);
