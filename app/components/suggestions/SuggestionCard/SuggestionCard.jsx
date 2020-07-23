import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CardStatusIndicator, CardLocation } from 'components/cards';
import { Message } from 'components/common';

import { CARD, INTEGRATIONS, INTEGRATIONS_MAP, SEGMENT, AUDIT } from 'appConstants';
import { copyCardUrl } from 'utils/card';
import { NodePropTypes } from 'utils/propTypes';

import { getStyleApplicationFn } from 'utils/style';
import { replaceHighlights, getHighlightRegex, joinSections } from 'utils/search';
import mainStyle from '../styles/suggestion.css';

import SuggestionDropdown from '../SuggestionDropdown';

const s = getStyleApplicationFn(mainStyle);

const HIGHLIGHT = {
  start: '<HIGHLIGHT>',
  end: '</HIGHLIGHT>'
};

const HIGHLIGHT_REGEX = getHighlightRegex(HIGHLIGHT);

const getBestAnalyzer = (highlights, baseKey) => {
  let maxHighlightLength = 0;
  let bestMatches = null;

  Object.entries(highlights).forEach(([analyzerKey, matches]) => {
    if (analyzerKey.startsWith(baseKey)) {
      const totalHighlightLength = matches.reduce((aggNum, match) => {
        // Calculate the length of all tokens between highlight tags
        const highlightMatches = match.matchAll(HIGHLIGHT_REGEX);
        const highlightMatchGroups = [...highlightMatches].map(
          (highlightMatch) => highlightMatch[1]
        );
        const highlightLength = highlightMatchGroups.join('').length;

        return aggNum + highlightLength;
      }, 0);

      if (totalHighlightLength > maxHighlightLength) {
        bestMatches = matches;
        maxHighlightLength = totalHighlightLength;
      }
    }
  });

  return bestMatches;
};

const replaceHighlightTags = (matches) => {
  let sections = [];

  matches.forEach((match, i) => {
    if (i > 0) {
      sections.push(<span>...&nbsp;</span>);
    }
    const matchSections = replaceHighlights(match, HIGHLIGHT);
    sections = sections.concat(matchSections);
  });

  return joinSections(sections);
};

const SuggestionCard = ({
  id,
  question,
  maxQuestionLines,
  answer,
  createdFromSlack,
  externalLinkAnswer,
  searchLogId,
  source,
  highlight,
  showAnswer,
  status,
  finderNode,
  event,
  className,
  showMoreMenu,
  openCard,
  trackEvent
}) => {
  const [showShare, setShowShare] = useState(false);

  const shareCard = () => {
    // Create invisible element with text
    copyCardUrl(id);
    setShowShare(true);
  };

  const renderShareSuccess = () => {
    return (
      <Message
        message={<div className={s('suggestion-share')}>Copied link to clipboard!</div>}
        show={showShare}
        onHide={() => setShowShare(false)}
        animate
        temporary
      />
    );
  };

  const renderExternalLogo = () => {
    if (!externalLinkAnswer && !createdFromSlack) {
      return null;
    }

    let logo;
    let type;

    if (externalLinkAnswer) {
      ({ logo, type } = INTEGRATIONS_MAP[externalLinkAnswer.type]);
    } else {
      // Created from Slack
      ({ logo, type } = INTEGRATIONS.SLACK);
    }

    return <img src={logo} alt={type} className={s('suggestion-external-logo')} />;
  };

  const clickOpenCard = () => {
    if (event) {
      const eventProperties = { 'Card ID': id, Question: question, Status: status };
      trackEvent(event, eventProperties);
    }

    openCard({ _id: id, baseLogId: searchLogId, source });
  };

  const render = () => {
    const highlightQuestion = getBestAnalyzer(highlight, 'question');
    const highlightAnswer = getBestAnalyzer(highlight, 'answer');

    const displayedQuestion = highlightQuestion
      ? replaceHighlightTags(highlightQuestion)
      : question;

    let displayedAnswer = highlightAnswer && replaceHighlightTags(highlightAnswer);
    if (!displayedAnswer) {
      displayedAnswer = externalLinkAnswer ? externalLinkAnswer.link : answer;
    }

    const ACTIONS = [
      {
        label: 'Share Card',
        onClick: shareCard
      }
    ];

    return (
      <div className={s(`${className} suggestion-elem`)} onClick={clickOpenCard}>
        <div className={s('flex justify-between')}>
          <CardLocation
            finderNode={finderNode}
            className={s('min-w-0')}
            pathClassName={s('suggestion-elem-path')}
            maxPathLength={3}
          />
          <div className={s('flex items-center self-end')}>
            <CardStatusIndicator status={status} />
            {showMoreMenu && <SuggestionDropdown actions={ACTIONS} />}
          </div>
        </div>
        <div className={s('flex flex-col w-full')}>
          <div className={s('flex')}>
            <span className={s(`suggestion-elem-title break-words line-clamp-${maxQuestionLines}`)}>
              {displayedQuestion}
            </span>
            {renderExternalLogo()}
          </div>
          {showAnswer && displayedAnswer && (
            <span
              className={s(
                'mt-xs text-xs text-gray-dark font-medium line-clamp-2 break-words wb-break-words'
              )}
            >
              {displayedAnswer}
            </span>
          )}
        </div>
        {renderShareSuccess()}
      </div>
    );
  };

  return render();
};

SuggestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  maxQuestionLines: PropTypes.number,
  answer: PropTypes.string,
  createdFromSlack: PropTypes.bool.isRequired,
  externalLinkAnswer: PropTypes.shape({
    link: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }),
  searchLogId: PropTypes.string,
  source: PropTypes.oneOf(Object.values(AUDIT.SOURCE)),
  highlight: PropTypes.shape({
    question: PropTypes.arrayOf(PropTypes.string),
    answer: PropTypes.arrayOf(PropTypes.string)
  }),
  showAnswer: PropTypes.bool,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  finderNode: NodePropTypes,
  event: PropTypes.oneOf(Object.values(SEGMENT.EVENT)),
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionCard.defaultProps = {
  className: '',
  highlight: {},
  maxQuestionLines: 2,
  showAnswer: true,
  showMoreMenu: false
};

export default SuggestionCard;
