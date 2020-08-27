import _ from 'lodash';
import queryString from 'query-string';
import { INTEGRATIONS, NODE_ENV, REQUEST, USER } from 'appConstants';

export function hasCompletedOnboarding(user) {
  return (
    user &&
    !!user.onboarding &&
    Object.values(USER.ONBOARDING.TYPE).every(
      (type) => user.onboarding[type] === USER.ONBOARDING.COMPLETE
    )
  );
}

export function isValidUser(user) {
  return !!user && !_.isEmpty(user) && !!user.isVerified && hasCompletedOnboarding(user);
}

export function isEditor(user) {
  const EDITOR_ROLES = [USER.ROLE.ADMIN, USER.ROLE.EDITOR];
  return EDITOR_ROLES.includes(user.role);
}

export function isLoggedIn(user = {}, integration) {
  const integrationInfo = _.get(user, `integrations.${integration}`);
  if (!integrationInfo) {
    return false;
  }

  switch (integration) {
    case INTEGRATIONS.CONFLUENCE.type:
    case INTEGRATIONS.JIRA.type: {
      const { access_token: accessToken, oauthAccessToken, deployedSiteUrl } = integrationInfo;
      return deployedSiteUrl ? !!oauthAccessToken : !!accessToken;
    }
    default:
      return !!integrationInfo.access_token;
  }
}

export function getIntegrationAuthLink(userId, token, integration, queryParams = {}) {
  switch (integration) {
    case INTEGRATIONS.SLACK.type: {
      const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=902571434263.${
        process.env.NODE_ENV === NODE_ENV.DEV ? '1009616749152' : '910615559953'
      }&scope=chat:write,commands,chat:write.public&user_scope=channels:history,channels:read,chat:write,groups:history,groups:read,im:history,im:read,im:write,mpim:history,mpim:read,mpim:write,search:read,team:read,users.profile:read,users:read,users:read.email&state=`;
      return `${slackAuthUrl}${userId}`;
    }
    case INTEGRATIONS.OUTLOOK.type:
    case INTEGRATIONS.SALESFORCE.type:
    case INTEGRATIONS.DROPBOX.type:
    case INTEGRATIONS.ZENDESK.type:
    case INTEGRATIONS.GMAIL.type:
    case INTEGRATIONS.GOOGLE.type:
    case INTEGRATIONS.CONFLUENCE.type:
    case INTEGRATIONS.JIRA.type: {
      const clearToken = token.replace('Bearer ', '');
      const params = { auth: clearToken, ...queryParams };
      return `${REQUEST.URL.SERVER}/${integration}/authenticate?${queryString.stringify(params)}`;
    }
    default:
      return '';
  }
}

export default {
  hasCompletedOnboarding,
  isValidUser,
  isLoggedIn,
  getIntegrationAuthLink,
  isEditor
};
