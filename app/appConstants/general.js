import SlackIcon from 'assets/images/icons/Slack_Mark.svg';
import GoogleDriveIcon from 'assets/images/icons/GoogleDrive_Icon.svg';
import ZendeskIcon from 'assets/images/icons/Zendesk_Icon.svg';
import GmailIcon from 'assets/images/icons/Gmail_Icon.svg';
import JiraIcon from 'assets/images/icons/Jira_Icon.svg';
import SalesforceIcon from 'assets/images/icons/Salesforce_Icon.svg';
import HubspotIcon from 'assets/images/icons/Hubspot_Icon.svg';
import HelpscoutIcon from 'assets/images/icons/Helpscout_Icon.svg';
import GoogleChromeIcon from 'assets/images/icons/GoogleChrome_Icon.svg';

export const ROUTES = {
  ASK: '/ask',
  CREATE: '/create',
  NAVIGATE: '/navigate',
  TASKS: '/tasks',
  PROFILE: '/profile',
  VERIFY: '/verify',
  SUGGEST: '/suggest',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot'
};

export const NODE_ENV = {
  DEV: 'development',
  PROD: 'production',
}

export const MAIN_CONTAINER_ID = 'omni-chrome-ext-main-container';

export const WEB_APP_EXTENSION_URL = 'file:///Users/andrewchang/Downloads/index.html';

export const INTEGRATIONS = {
  GOOGLE: { type: 'google', title: 'Google Drive', logo: GoogleDriveIcon },
  SLACK: { type: 'slack', title: 'Slack', logo: SlackIcon },
  ZENDESK: { type: 'zendesk', title: 'Zendesk', logo: ZendeskIcon },
  HELPSCOUT: { type: 'helpscout', title: 'Helpscout', logo: HelpscoutIcon },
  GMAIL: { type: 'gmail', title: 'Gmail', logo: GmailIcon },
  SALESFORCE: { type: 'salesforce', title: 'Salesforce', logo: SalesforceIcon },
  JIRA: { type: 'jira', title: 'Jira', logo: SalesforceIcon },
  HUBSPOT: { type: 'hubspot', title: 'Hubspot', logo: HubspotIcon },
};

export const NOOP = () => {};

export default { ROUTES, NODE_ENV, MAIN_CONTAINER_ID, WEB_APP_EXTENSION_URL, INTEGRATIONS };