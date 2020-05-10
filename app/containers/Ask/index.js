import { connect } from 'react-redux';
import {
  changeAskIntegration,
  requestAddAskAttachment,
  requestRemoveAskAttachment,
  updateAskAttachmentName,
  requestAskQuestion,
  updateAskQuestionTitle,
  updateAskQuestionDescription,
  removeAskRecipient,
  updateAskRecipient,
  addAskRecipient,
  requestGetSlackConversations,
  showAskDescriptionEditor
} from 'actions/ask';
import { toggleDockHeight } from 'actions/display';

import Ask from './Ask';

const mapStateToProps = (state) => {
  const {
    ask: {
      activeIntegration,
      attachments,
      isAskingQuestion,
      questionTitle,
      questionDescription,
      recipients,
      slackConversations,
      showPerformanceScore,
      isDescriptionEditorShown
    },
    display: { dockExpanded },
    profile: { user }
  } = state;

  return {
    activeIntegration,
    isDescriptionEditorShown,
    attachments,
    isAskingQuestion,
    questionTitle,
    questionDescription,
    recipients,
    slackConversations,
    dockExpanded,
    showPerformanceScore,
    user
  };
};

const mapDispatchToProps = {
  toggleDockHeight,
  changeAskIntegration,
  showAskDescriptionEditor,
  requestAddAskAttachment,
  requestRemoveAskAttachment,
  updateAskAttachmentName,
  requestAskQuestion,
  updateAskQuestionTitle,
  updateAskQuestionDescription,
  removeAskRecipient,
  updateAskRecipient,
  addAskRecipient,
  requestGetSlackConversations
};

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
