import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import { requestSearchCards } from 'actions/search';
import * as createActions from 'actions/create';
import Create from './Create';

const mapStateToProps = (state) => {
  const {
    create: {
      question,
      descriptionEditorState,
      answerEditorState,
      attachments,
      finderNode,
      isTemplateView,
      templates,
      selectedTemplateCategory
    },
    profile: { user }
  } = state;

  return {
    question,
    descriptionEditorState,
    answerEditorState,
    attachments,
    finderNode,
    isTemplateView,
    templates,
    selectedTemplateCategory,
    user
  };
};

const mapDispatchToProps = {
  openCard,
  requestSearchCards,
  ...createActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
