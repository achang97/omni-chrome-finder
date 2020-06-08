import queryString from 'query-string';
import { INTEGRATIONS, NODE_ENV, REQUEST, PROFILE } from 'appConstants';

export function hasCompletedOnboarding(onboarding) {
  return (
    !!onboarding &&
    onboarding.admin === PROFILE.ONBOARDING_COMPLETE &&
    onboarding.member === PROFILE.ONBOARDING_COMPLETE
  );
}

export function isValidUser(token, user) {
  return !!token && !!user.isVerified && hasCompletedOnboarding(user.onboarding);
}

export function isLoggedIn(user, integration) {
  // use new userIntegrations here.
  return (
    !!user &&
    !!user.integrations &&
    !!user.integrations[integration] &&
    !!user.integrations[integration].access_token
  );
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
