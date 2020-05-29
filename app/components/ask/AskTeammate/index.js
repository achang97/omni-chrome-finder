import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
      slackConversations,
      isGettingSlackConversations
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
    isGettingSlackConversations,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AskTeammate));
