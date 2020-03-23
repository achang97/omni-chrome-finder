import { INTEGRATIONS, SLACK_AUTH_URL } from './constants';
import { SERVER_URL } from './request';

export function isLoggedIn(user, integration) {
  // use new userIntegrations here.
  return user &&
    user.integrations &&
    user.integrations[integration] &&
    !!user.integrations[integration].access_token;
}

export function getIntegrationAuthLink(userId, token, integration) {
  switch (integration) {
    case INTEGRATIONS.SLACK: {
      const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=902571434263.${process.env.NODE_ENV === 'development' ? '1009616749152' : '910615559953'}&scope=app_mentions:read,channels:history,channels:join,channels:read,chat:write,commands,files:read,groups:history,groups:read,im:history,im:read,im:write,links:read,mpim:history,mpim:read,mpim:write,reminders:read,reminders:write,remote_files:read,remote_files:share,remote_files:write,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:read.email,users:write&user_scope=channels:history,channels:read,channels:write,chat:write,emoji:read,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,mpim:history,mpim:read,mpim:write,reactions:read,reminders:read,reminders:write,remote_files:read,remote_files:share,search:read,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:read.email,users:write&state=`;
      return `${slackAuthUrl}${userId}`;
    }
    case INTEGRATIONS.ZENDESK:
    case INTEGRATIONS.GOOGLE: {
      const clearToken = token.replace('Bearer ', '');
      return `${SERVER_URL}/${integration}/authenticate?auth=${clearToken}`;
    }
    default:
      return '';
  }
}
