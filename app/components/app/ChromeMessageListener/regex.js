import { INTEGRATIONS, EXTERNAL_VERIFICATION } from 'appConstants';

// TODO: Find a better way to share regexes
const SEARCH_BAR_REGEXES = [
  {
    integration: INTEGRATIONS.ZENDESK,
    regex: /https:\/\/\S+\.zendesk\.com\/(?:agent\/tickets\/\d+|chat\/agent#visitors\/visitor_list\/state#!\S+)/
  },
  {
    integration: INTEGRATIONS.JIRA,
    regex: /https:\/\/\S+\.atlassian\.net\/(?:issues|browse|jira\/servicedesk\/projects\/[^/]+\/queues\/custom\/\d+\/\S+)/
  },
  {
    integration: INTEGRATIONS.SLACK,
    regex: /https:\/\/app.slack.com\/client\/[^/]+\/[^/]+/
  },
  {
    integration: INTEGRATIONS.CONFLUENCE,
    regex: EXTERNAL_VERIFICATION.URL_REGEXES[INTEGRATIONS.CONFLUENCE.type].regex
  },
  {
    integration: INTEGRATIONS.GOOGLE,
    regex: EXTERNAL_VERIFICATION.URL_REGEXES[INTEGRATIONS.GOOGLE.type].regex
  }
];

export default SEARCH_BAR_REGEXES;
