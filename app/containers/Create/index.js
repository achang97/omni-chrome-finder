import { connect } from 'react-redux';
import { openCard } from 'actions/cards';
import { requestSearchCards } from 'actions/search';
import * as createActions from 'actions/create';
import trackEvent from 'actions/analytics';
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
  ...createActions,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
