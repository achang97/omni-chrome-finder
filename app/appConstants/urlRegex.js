import { getArrayField } from 'utils/array';
import { INTEGRATIONS } from './general';

function trimTitle(documentTitle, sepChar = '-') {
  return documentTitle.substring(0, documentTitle.lastIndexOf(` ${sepChar} `));
}

function getDefaultLinkObject(regexMatch) {
  return { link: regexMatch[0] };
}

function getDefaultTitle(title) {
  return title;
}

function createRegexPrefix(urls) {
  // TODO: Replace with global string util function (replaceAll)
  const escapedPrefixes = urls
    .filter((url) => !!url)
    .map((url) => {
      let newPrefix = url;

      newPrefix = newPrefix.replace(new RegExp('/', 'g'), '\\/');
      newPrefix = newPrefix.replace(new RegExp('\\.', 'g'), '\\.');

      return newPrefix;
    });

  return `(${escapedPrefixes.join('|')})`;
}

export const getExternalVerificationRegexes = (userIntegrations) => {
  const {
    [INTEGRATIONS.CONFLUENCE.type]: { sites: confluenceSites = [], deployedSiteUrl },
    [INTEGRATIONS.ZENDESK.type]: { brands: zendeskBrands = [] }
  } = userIntegrations;

  const confluencePrefix = createRegexPrefix([
    ...getArrayField(confluenceSites, 'url'),
    deployedSiteUrl
  ]);
  const zendeskPrefix = createRegexPrefix(getArrayField(zendeskBrands, 'brand_url'));

  return {
    [INTEGRATIONS.GOOGLE.type]: {
      regex: /https:\/\/(docs|drive)\.google\.com\/[^/]+\/d\/[^/]+/,
      getTitle: trimTitle,
      getLinks: (regexMatch) => {
        const link = regexMatch[0];
        const previewLink = `${regexMatch[0]}/preview`;
        return { link, previewLink };
      }
    },
    [INTEGRATIONS.DROPBOX.type]: {
      regex: /https:\/\/www\.dropbox\.com\/s\/[^/]+/,
      getTitle: getDefaultTitle,
      getLinks: getDefaultLinkObject
    },
    [INTEGRATIONS.TETTRA.type]: {
      regex: /https:\/\/app\.tettra\.co\/teams\/[^/]+\/pages\/[^/#]+/,
      getTitle: (documentTitle) => trimTitle(trimTitle(documentTitle)),
      getLinks: getDefaultLinkObject
    },
    [INTEGRATIONS.NOTION.type]: {
      regex: /https:\/\/(?:www\.)?notion\.so\/([^/#]+)[^/#]{32}/,
      getTitle: getDefaultTitle,
      getLinks: (regexMatch) => ({ link: regexMatch[0].replace(regexMatch[1], '') })
    },
    [INTEGRATIONS.CONFLUENCE.type]: {
      regex: new RegExp(`${confluencePrefix}\\/wiki\\/spaces\\/[^/]+\\/pages\\/\\d+`),
      getTitle: (documentTitle) => trimTitle(trimTitle(documentTitle)),
      getLinks: getDefaultLinkObject
    },
    [INTEGRATIONS.ZENDESK.type]: {
      regex: new RegExp(`${zendeskPrefix}\\/hc\\/\\S+\\/articles\\/\\d+`),
      getTitle: (documentTitle) => trimTitle(documentTitle, '–'),
      getLinks: getDefaultLinkObject
    }
  };
};

export function getSearchBarRegexes(userIntegrations) {
  const {
    [INTEGRATIONS.JIRA.type]: { sites: jiraSites = [], deployedSiteUrl },
    [INTEGRATIONS.ZENDESK.type]: { brands: zendeskBrands = [] }
  } = userIntegrations;

  const jiraPrefix = createRegexPrefix([...getArrayField(jiraSites, 'url'), deployedSiteUrl]);
  const zendeskPrefix = createRegexPrefix(getArrayField(zendeskBrands, 'brand_url'));

  const externalVerificationRegexes = getExternalVerificationRegexes(userIntegrations);

  return [
    {
      integration: INTEGRATIONS.SLACK,
      regex: /https:\/\/app.slack.com\/client\/[^/]+\/[^/]+/
    },
    {
      integration: INTEGRATIONS.ZENDESK,
      regex: new RegExp(
        `${zendeskPrefix}\\/(?:agent\\/tickets\\/\\d+|chat\\/agent#visitors\\/visitor_list\\/state#!\\S+)`
      )
    },
    {
      integration: INTEGRATIONS.JIRA,
      regex: new RegExp(
        `${jiraPrefix}\\/(?:issues|browse|jira\\/servicedesk\\/projects\\/[^/]+\\/queues\\/custom\\/\\d+\\/\\S+)`
      )
    },
    {
      integration: INTEGRATIONS.CONFLUENCE,
      regex: externalVerificationRegexes[INTEGRATIONS.CONFLUENCE.type].regex
    }
  ];
}

export default { getExternalVerificationRegexes, getSearchBarRegexes };
