import _ from 'lodash';
import queryString from 'query-string';
import { INTEGRATIONS, NODE_ENV, REQUEST, USER } from 'appConstants';

export function hasCompletedOnboarding(onboarding) {
  return (
    !!onboarding &&
    Object.values(USER.ONBOARDING.TYPE).every(
      (type) => onboarding[type] === USER.ONBOARDING.COMPLETE
    )
  );
}

export function isValidUser(user) {
  return !!user && !_.isEmpty(user) && !!user.isVerified && hasCompletedOnboarding(user.onboarding);
}

export function isLoggedIn(user = {}, integration) {
  const integrationInfo = _.get(user, `integrations.${integration}`);
  if (!integrationInfo) {
    return false;
  }

  switch (integration) {
    case INTEGRATIONS.CONFLUENCE.type:
    case INTEGRATIONS.JIRA.type: {
      const { access_token: accessToken, oauthTokenSecret, deployedSiteUrl } = integrationInfo;
      return deployedSiteUrl ? !!oauthTokenSecret : !!accessToken;
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
    case INTEGRATIONS.ZENDESK.type:
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

export default { hasCompletedOnboarding, isValidUser, isLoggedIn, getIntegrationAuthLink };
