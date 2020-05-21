import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';

import { getStyleApplicationFn } from 'utils/style';
import style from './suggestion-preview.css';

const s = getStyleApplicationFn(style);

const SuggestionPreview = ({ id, question, questionDescription, answer, openCard, trackEvent }) => {
  const clickOpenCard = () => {
    trackEvent('Open Card from Search', { 'Card ID': id, Question: question });
    openCard({ _id: id });
  };

  return (
    <div className={s('suggestion-preview')}>
      <div className={s('bg-purple-2xlight p-reg rounded-t-lg')}>
        <div className={s('suggestion-elem-title line-clamp-3 break-words')}>{question}</div>
        {questionDescription && (
          <div className={s('mt-reg text-xs text-gray-dark font-medium line-clamp-2 break-words')}>
            {questionDescription}
          </div>
        )}
      </div>
      {answer && (
        <div className={s('bg-white p-reg text-sm line-clamp-3 break-words')}>{answer}</div>
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
  questionDescription: PropTypes.string,
  answer: PropTypes.string.isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionPreview.defaultProps = {
  questionDescription: null
};

export default SuggestionPreview;
