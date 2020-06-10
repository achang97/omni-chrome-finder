import React from 'react';
import PropTypes from 'prop-types';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';

import ExternalResult from '../ExternalResult';

const s = getStyleApplicationFn();

const ZendeskResult = ({
  html_url: htmlUrl,
  author,
  title,
  draft,
  promoted,
  vote_sum: voteSum,
  logo,
  card,
  onClick
}) => (
  <ExternalResult
    url={htmlUrl}
    onClick={onClick}
    title={title}
    logo={logo}
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
  html_url: PropTypes.string.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string
  }),
  title: PropTypes.string.isRequired,
  promoted: PropTypes.bool.isRequired,
  draft: PropTypes.bool.isRequired,
  vote_sum: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  card: PropTypes.shape({})
};

export default ZendeskResult;
