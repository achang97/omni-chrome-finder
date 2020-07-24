import React from 'react';
import PropTypes from 'prop-types';

import { INTEGRATIONS_MAP, SEGMENT, AUDIT } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './suggestion-preview.css';

const s = getStyleApplicationFn(style);

const SuggestionPreview = ({
  id,
  question,
  answer,
  externalLinkAnswer,
  source,
  searchLogId,
  openCard,
  trackEvent
}) => {
  const clickOpenCard = () => {
    trackEvent(SEGMENT.EVENT.OPEN_CARD_FROM_SEARCH, { 'Card ID': id, Question: question });
    openCard({ _id: id, baseLogId: searchLogId, source });
  };

  const renderExternalLogo = () => {
    if (!externalLinkAnswer) {
      return null;
    }

    const { logo } = INTEGRATIONS_MAP[externalLinkAnswer.type];
    return (
      <img
        src={logo}
        alt={externalLinkAnswer.type}
        className={s('suggestion-external-logo mt-xs')}
      />
    );
  };

  const displayedAnswer = externalLinkAnswer ? externalLinkAnswer.link : answer;

  return (
    <div
      className={s('suggestion-preview rounded-lg overflow-hidden cursor-pointer')}
      onClick={clickOpenCard}
    >
      <div className={s('flex bg-purple-2xlight p-reg')}>
        <div className={s('suggestion-elem-title line-clamp-3 break-words')}>{question}</div>
        {renderExternalLogo()}
      </div>
      {displayedAnswer && (
        <div className={s('bg-white p-reg text-sm')}>
          <div className={s('line-clamp-3 break-words')}>{displayedAnswer}</div>
        </div>
      )}
    </div>
  );
};

SuggestionPreview.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  externalLinkAnswer: PropTypes.shape({
    link: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }),
  source: PropTypes.oneOf(Object.values(AUDIT)),
  searchLogId: PropTypes.string,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default SuggestionPreview;
