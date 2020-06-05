import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';
import { INTEGRATIONS_MAP } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './suggestion-preview.css';

const s = getStyleApplicationFn(style);

const SuggestionPreview = ({ id, question, answer, externalLinkAnswer, openCard, trackEvent }) => {
  const clickOpenCard = () => {
    trackEvent('Open Card from Search', { 'Card ID': id, Question: question });
    openCard({ _id: id });
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
    <div className={s('suggestion-preview')}>
      <div className={s('flex bg-purple-2xlight p-reg rounded-t-lg')}>
        <div className={s('suggestion-elem-title line-clamp-3 break-words')}>{question}</div>
        {renderExternalLogo()}
      </div>
      {displayedAnswer && (
        <div className={s('bg-white p-reg text-sm')}>
          <div className={s('line-clamp-3 break-words')}>{displayedAnswer}</div>
        </div>
      )}
      <div className={s('bg-white rounded-b-lg')} onClick={clickOpenCard}>
        <Button
          text="View full card"
          underline
          color="transparent"
          className={s('rounded-t-none py-sm')}
          textClassName={s('text-sm')}
        />
      </div>
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

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default SuggestionPreview;
