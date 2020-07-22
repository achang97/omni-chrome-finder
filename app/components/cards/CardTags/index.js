import { connect } from 'react-redux';
import { requestSearchTags } from 'actions/search';
import CardTags from './CardTags';

const mapStateToProps = (state) => {
  const {
    search: { tags, isSearchingTags },
    auth: { token }
  } = state;

  console.log(tags);

  return { tagOptions: tags, isSearchingTags, token };
};

const mapDispatchToProps = {
  requestSearchTags
};

export default connect(mapStateToProps, mapDispatchToProps)(CardTags);
