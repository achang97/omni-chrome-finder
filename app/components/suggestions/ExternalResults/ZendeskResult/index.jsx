import React from 'react';
import PropTypes from 'prop-types';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';
import { INTEGRATIONS } from 'appConstants';

import ExternalResult from '../ExternalResult';

const s = getStyleApplicationFn();

const ZendeskResult = ({
  id,
  html_url: htmlUrl,
  author,
  title,
  draft,
  promoted,
  vote_sum: voteSum,
  card
}) => (
  <ExternalResult
    id={id}
    url={htmlUrl}
    title={title}
    logo={INTEGRATIONS.ZENDESK.logo}
    type={INTEGRATIONS.ZENDESK.type}
    card={card}
    body={
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
    }
  />
);

ZendeskResult.propTypes = {
  id: PropTypes.string.isRequired,
  html_url: PropTypes.string.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string
  }),
  title: PropTypes.string.isRequired,
  promoted: PropTypes.bool.isRequired,
  draft: PropTypes.bool.isRequired,
  vote_sum: PropTypes.number.isRequired,
  card: PropTypes.shape({})
};

export default ZendeskResult;
