import { connect } from 'react-redux';
import {
  changeAskIntegration,
  requestAddAskAttachment,
  requestRemoveAskAttachment,
  updateAskAttachmentName,
  requestAskQuestion,
  updateAskQuestionTitle,
  removeAskRecipient,
  updateAskRecipient,
  addAskRecipient,
  requestGetSlackConversations,
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
      recipients,
      slackConversations,
      showPerformanceScore
    },
    display: { dockExpanded },
    profile: { user }
  } = state;

  return {
    activeIntegration,
    attachments,
    isAskingQuestion,
    questionTitle,
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
  requestAddAskAttachment,
  requestRemoveAskAttachment,
  updateAskAttachmentName,
  requestAskQuestion,
  updateAskQuestionTitle,
  removeAskRecipient,
  updateAskRecipient,
  addAskRecipient,
  requestGetSlackConversations
};

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
