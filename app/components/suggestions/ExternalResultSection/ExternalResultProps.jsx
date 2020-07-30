import React from 'react';
import moment from 'moment';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';
import { Timeago } from 'components/common';

import { INTEGRATIONS } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import { createHighlightedElement } from 'utils/search';

import style from './external-result-section.css';

const s = getStyleApplicationFn(style);

const getItemProps = (type, item) => {
  switch (type) {
    case INTEGRATIONS.GOOGLE.type: {
      const { iconLink, owners } = item;
      return {
        logo: iconLink,
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
      const { snippet, vote_sum: voteSum, author, promoted, draft, commonProps } = item;
      return {
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
              {createHighlightedElement(snippet, commonProps.highlightTags)}
            </div>
          </>
        )
      };
    }
    case INTEGRATIONS.SLACK.type: {
      const { ts, text, user, channel, commonProps } = item;
      return {
        showTitle: false,
        body: (
          <>
            <div className={s('flex items-center mb-sm')}>
              <div className={s('font-bold text-xs mr-sm truncate')}>
                {channel.is_channel || channel.is_group ? `#${channel.name}` : 'Direct Message'}
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
                {createHighlightedElement(text, commonProps.highlightTags)}
              </div>
            </div>
          </>
        )
      };
    }
    case INTEGRATIONS.SALESFORCE.type: {
      const { type: resultType } = item;
      return {
        body: <div> {resultType} </div>
      };
    }
    default:
      return {};
  }
};

export default getItemProps;
