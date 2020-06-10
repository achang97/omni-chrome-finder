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

export const URL_REGEXES = {
  [INTEGRATIONS.GOOGLE.type]: {
    regex: /https:\/\/(docs|drive)\.google\.com\/[^/]+\/d\/[^/]+/,
    getTitle: trimTitle,
    getLinks: (regexMatch) => {
      const link = regexMatch[0];
      const previewLink = `${regexMatch[0]}/preview`;
      return { link, previewLink };
    }
  },
  [INTEGRATIONS.CONFLUENCE.type]: {
    regex: /https:\/\/\S+.atlassian.net\/wiki\/spaces\/[^/]+\/pages\/\d+/,
    getTitle: (documentTitle) => trimTitle(trimTitle(documentTitle)),
    getLinks: getDefaultLinkObject
  },
  [INTEGRATIONS.ZENDESK.type]: {
    regex: /https:\/\/\S+\.(zendesk|\S+)\.com\/hc\/\S+\/articles\/\d+/,
    getTitle: (documentTitle) => trimTitle(documentTitle, '–'),
    getLinks: getDefaultLinkObject
    // regex: /https:\/\/\S+\.(zendesk|\S+)\.com(\/(hc\/\S+|knowledge))\/articles\/\d+/
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
  }
};

export default { URL_REGEXES };
