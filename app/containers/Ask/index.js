import { connect } from 'react-redux';
import { requestSearchCards } from 'actions/search';
import {
  changeAskIntegration,
  requestAddAskAttachment, requestRemoveAskAttachment, updateAskAttachmentName,
  requestAskQuestion, updateAskQuestionTitle, updateAskQuestionDescription,
  removeAskRecipient, updateAskRecipient, addAskRecipient,
  requestGetSlackConversations,  
} from 'actions/ask';
import Ask from './Ask';

const mapStateToProps = state => {
  const { 
    ask: {
      activeIntegration,
      attachments,
      isAskingQuestion,
      askError, askSuccess,
      questionTitle, 
      questionDescription,
      recipients,
      slackConversations,
      isGettingSlackConversations,
      getSlackConversationsError,
      showPerformanceScore,
    },
    display: {
      dockExpanded
    },
    profile: {
      user
    },
    auth: {
      token
    }
  } = state;

  return {
    activeIntegration,
    attachments,
    isAskingQuestion,
    askError, askSuccess,
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
}

const mapDispatchToProps = {
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
  requestSearchCards, 
}

export default connect(mapStateToProps, mapDispatchToProps)(Ask);
