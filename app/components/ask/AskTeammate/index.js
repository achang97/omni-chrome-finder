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
  toggleAskTeammate,
  requestGetSlackConversations
} from 'actions/ask';

import AskTeammate from './AskTeammate';

const mapStateToProps = (state) => {
  const {
    ask: {
      activeIntegration,
      attachments,
      isAskingQuestion,
      questionTitle,
      recipients,
      slackConversations
    },
    profile: { user }
  } = state;

  return {
    activeIntegration,
    attachments,
    isAskingQuestion,
    questionTitle,
    recipients,
    slackConversations,
    user
  };
};

const mapDispatchToProps = {
  toggleAskTeammate,
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

export default connect(mapStateToProps, mapDispatchToProps)(AskTeammate);
