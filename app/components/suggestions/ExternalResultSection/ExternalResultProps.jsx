import React from 'react';
import moment from 'moment';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';
import { Timeago } from 'components/common';

import { INTEGRATIONS } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import { createHighlightedElement } from 'utils/search';

import style from './external-result-section.css';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const s = getStyleApplicationFn(style);

const HIGHLIGHT_TAGS = {
  SLACK: { start: '\ue000', end: '\ue001' },
  CONFLUENCE: { start: '@@@hl@@@', end: '@@@endhl@@@' },
  ZENDESK: { start: '<em>', end: '</em>' }
};

const getItemProps = (type, item) => {
  switch (type) {
    case INTEGRATIONS.GOOGLE.type: {
      const { id, webViewLink, iconLink, name, owners, mimeType } = item;
      return {
        logo: iconLink,
        id,
        url: webViewLink,
        title: name,
        showDropdown: mimeType !== FOLDER_MIME_TYPE,
        body: owners && (
          <>
            {owners.map(({ displayName, permissionId, me }, i) => (
              <React.Fragment key={permissionId}>
                <span>{me ? 'You' : displayName}</span>
                {i !== owners.length - 1 && <span>, </span>}
              </React.Fragment>
            ))}
          </>
        )
      };
    }
    case INTEGRATIONS.ZENDESK.type: {
      const {
        id,
        html_url: htmlUrl,
        title,
        snippet,
        vote_sum: voteSum,
        author,
        promoted,
        draft
      } = item;
      return {
        id,
        url: htmlUrl,
        title,
        body: (
          <>
            <div className={s('flex items-center')}>
              <div
                className={s(`
                  flex items-center mr-sm
                  ${voteSum > 0 ? 'text-green-500' : ''}
                  ${voteSum < 0 ? 'text-red-500' : ''}
                `)}
              >
                {voteSum >= 0 ? <MdThumbUp /> : <MdThumbDown />}
                <div className={s('ml-xs')}> {voteSum} </div>
              </div>
              {author && <div className={s('mr-reg')}>{author.name}</div>}
              {promoted && <div className={s('italic mr-sm')}> Promoted </div>}
              {draft && <div className={s('italic mr-sm')}> Draft </div>}
            </div>
            <div className={s('line-clamp-2 excerpt-text mt-sm')}>
              {createHighlightedElement(snippet, HIGHLIGHT_TAGS.ZENDESK)}
            </div>
          </>
        ),
        showDropdown: true
      };
    }
    case INTEGRATIONS.CONFLUENCE.type: {
      const { id, url, title } = item;
      return {
        id,
        url,
        title,
        highlightTags: HIGHLIGHT_TAGS.CONFLUENCE,
        showDropdown: true
        // body: excerpt && (
        //   <div className={s('line-clamp-2 excerpt-text')}>
        //     {createHighlightedElement(excerpt, HIGHLIGHT_TAGS.CONFLUENCE)}
        //   </div>
        // )
      };
    }
    case INTEGRATIONS.JIRA.type: {
      const { id, url, title } = item;
      return { id, url, title, highlightTags: HIGHLIGHT_TAGS.CONFLUENCE, showDropdown: false };
    }
    case INTEGRATIONS.SLACK.type: {
      const { id, ts, text, permalink, user, channel } = item;
      return {
        id,
        url: permalink,
        showDropdown: false,
        body: (
          <>
            <div className={s('flex items-center mb-sm')}>
              <div className={s('font-bold text-xs mr-sm truncate')}>
                {channel ? `#${channel}` : 'Direct Message'}
              </div>
              <div className={s('font-bold text-black mr-sm flex-shrink-0')}> {user.name} </div>
              <Timeago
                className={s('ml-auto flex-shrink-0')}
                date={moment(ts, 'X').toDate()}
                live={false}
              />
            </div>
            <div className={s('flex items-start')}>
              <img src={user.imageUrl} alt="" className={s('slack-thumbnail')} />
              <div className={s('line-clamp-3 excerpt-text')}>
                {createHighlightedElement(text, HIGHLIGHT_TAGS.SLACK)}
              </div>
            </div>
          </>
        )
      };
    }
    default:
      return {};
  }
};

export default getItemProps;
