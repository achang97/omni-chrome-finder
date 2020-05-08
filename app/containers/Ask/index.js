import { connect } from 'react-redux';
import { requestSearchCards } from 'actions/search';
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
      askError,
      askSuccess,
      questionTitle,
      questionDescription,
      recipients,
      slackConversations,
      isGettingSlackConversations,
      getSlackConversationsError,
      showPerformanceScore,
      isDescriptionEditorShown
    },
    display: { dockExpanded },
    profile: { user },
    auth: { token }
  } = state;

  return {
    activeIntegration,
    isDescriptionEditorShown,
    attachments,
    isAskingQuestion,
    askError,
    askSuccess,
    questionTitle,
    questionDescription,
    recipients,
    slackConversations,
    isGettingSlackConversations,
    getSlackConversationsError,
    dockExpanded,
    showPerformanceScore,
    user,
    token
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
  requestGetSlackConversations,
  requestSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
