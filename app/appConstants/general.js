import _ from 'lodash';
import SlackIcon from 'assets/images/icons/Slack_Mark.svg';
import GoogleDriveIcon from 'assets/images/icons/GoogleDrive_Icon.svg';
import ZendeskIcon from 'assets/images/icons/Zendesk_Icon.svg';
import GmailIcon from 'assets/images/icons/Gmail_Icon.svg';
import JiraIcon from 'assets/images/icons/Jira_Icon.svg';
import SalesforceIcon from 'assets/images/icons/Salesforce_Icon.svg';
import HubspotIcon from 'assets/images/icons/Hubspot_Icon.svg';
import HelpscoutIcon from 'assets/images/icons/Helpscout_Icon.svg';
import DropboxIcon from 'assets/images/icons/Dropbox_Icon.svg';
import NotionIcon from 'assets/images/icons/Notion_Icon.svg';
import ConfluenceIcon from 'assets/images/icons/Confluence_Icon.svg';
import TettraIcon from 'assets/images/icons/Tettra_Icon.svg';

export const ROUTES = {
  ASK: '/ask',
  CREATE: '/create',
  TASKS: '/tasks',
  PROFILE: '/profile',
  VERIFY: '/verify',
  SUGGEST: '/suggest',
  MAIN_AUTH: '/mainAuth',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot',
  COMPLETE_ONBOARDING: '/completeOnboarding'
};

export const NODE_ENV = {
  DEV: 'development',
  PROD: 'production'
};

export const MAIN_CONTAINER_ID = 'omni-chrome-ext-main-container';
export const APP_CONTAINER_ID = 'omni-chrome-ext-react-app';
export const APP_CONTAINER_CLASSNAME = 'app-container';

export const WEB_APP_ROUTES = {
  EXTENSION: '/extension',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  BILLING: '/settings/billing'
};

const PROD_WEB_APP_URL = 'https://app.addomni.com';
export const URL = {
  WEB_APP: process.env.NODE_ENV === NODE_ENV.DEV ? 'http://localhost:5000' : PROD_WEB_APP_URL,
  EXTENSION: `${PROD_WEB_APP_URL}/extension`
};

export const INTEGRATIONS = {
  GOOGLE: { type: 'google', title: 'Google Drive', logo: GoogleDriveIcon },
  SLACK: { type: 'slack', title: 'Slack', logo: SlackIcon },
  ZENDESK: { type: 'zendesk', title: 'Zendesk', logo: ZendeskIcon },
  HELPSCOUT: { type: 'helpscout', title: 'Helpscout', logo: HelpscoutIcon },
  GMAIL: { type: 'gmail', title: 'Gmail', logo: GmailIcon },
  SALESFORCE: { type: 'salesforce', title: 'Salesforce', logo: SalesforceIcon },
  JIRA: { type: 'jira', title: 'Jira', logo: JiraIcon },
  HUBSPOT: { type: 'hubspot', title: 'Hubspot', logo: HubspotIcon },
  CONFLUENCE: { type: 'confluence', title: 'Confluence', logo: ConfluenceIcon },
  NOTION: { type: 'notion', title: 'Notion', logo: NotionIcon },
  TETTRA: { type: 'tettra', title: 'Tettra', logo: TettraIcon },
  DROPBOX: { type: 'dropbox', title: 'Dropbox', logo: DropboxIcon }
};

export const INTEGRATIONS_MAP = _.mapKeys(INTEGRATIONS, ({ type }) => type);

export const NOOP = () => {};

export default {
  ROUTES,
  WEB_APP_ROUTES,
  NODE_ENV,
  MAIN_CONTAINER_ID,
  APP_CONTAINER_ID,
  APP_CONTAINER_CLASSNAME,
  URL,
  INTEGRATIONS,
  INTEGRATIONS_MAP,
  NOOP
};
