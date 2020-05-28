import { INTEGRATIONS, NODE_ENV, REQUEST, PROFILE } from 'appConstants';

export function hasCompletedOnboarding(onboarding) {
  return (
    onboarding &&
    onboarding.extension &&
    Object.values(onboarding.extension).every((val) => val === PROFILE.ONBOARDING_COMPLETE)
  );
}

export function isValidUser(token, user) {
  return !!token && user.isVerified && hasCompletedOnboarding(user.onboarding);
}

export function isLoggedIn(user, integration) {
  // use new userIntegrations here.
  return (
    user &&
    user.integrations &&
    user.integrations[integration] &&
    !!user.integrations[integration].access_token
  );
}

export function getIntegrationAuthLink(userId, token, integration) {
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
    case INTEGRATIONS.GMAIL.type: {
      const clearToken = token.replace('Bearer ', '');
      return `${REQUEST.URL.SERVER}/${integration}/authenticate?auth=${clearToken}`;
    }
    default:
      return '';
  }
}

export default { hasCompletedOnboarding, isValidUser, isLoggedIn, getIntegrationAuthLink };
