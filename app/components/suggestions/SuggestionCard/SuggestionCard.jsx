import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreHoriz } from 'react-icons/md';

import { CardStatusIndicator, CardLocation } from 'components/cards';
import { Button, Dropdown, Message, Separator, ConfirmModal } from 'components/common';

import { CARD, INTEGRATIONS, INTEGRATIONS_MAP } from 'appConstants';
import { copyCardUrl } from 'utils/card';
import { NodePropTypes } from 'utils/propTypes';

import { getStyleApplicationFn } from 'utils/style';
import cardStyle from './suggestion-card.css';
import mainStyle from '../suggestion.css';

const s = getStyleApplicationFn(mainStyle, cardStyle);

const BUTTON_TYPE = {
  SHARE: 'SHARE'
};

const HIGHLIGHT_REGEX = /<HIGHLIGHT>(.+?)<\/HIGHLIGHT>/g;

const replaceHighlightTags = (matches) => {
  const sections = [];

  matches.forEach((match, i) => {
    const matchSections = match.split(HIGHLIGHT_REGEX);
    if (i > 0) {
      sections.push(<span>...&nbsp;</span>);
    }

    let start = 0;
    let j;

    for (j = 0; j < matchSections.length; j++) {
      const matchSection = matchSections[j];
      const nextMatchSection = j < matchSections.length - 1 && matchSections[j + 1];

      if (!nextMatchSection || (matchSection !== ' ' && nextMatchSection !== ' ')) {
        const showHighlight = j % 2 === 1;
        const matchElem = (
          <span className={s(showHighlight ? 'bg-purple-gray-20 rounded-sm font-bold' : '')}>
            {matchSections.slice(start, j + 1).join('')}
          </span>
        );

        sections.push(matchElem);
        start = j + 1;
      }
    }
  });

  return (
    <>
      {sections.map((section, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`section-${i}`}>{section}</React.Fragment>
      ))}
    </>
  );
};

const SuggestionCard = ({
  id,
  question,
  maxQuestionLines,
  answer,
  createdFromSlack,
  externalLinkAnswer,
  highlight,
  showAnswer,
  status,
  finderNode,
  className,
  showMoreMenu,
  openCard,
  trackEvent
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonActive, setButtonActive] = useState(_.mapValues(BUTTON_TYPE, () => false));

  const toggleActiveButton = (type, value) => {
    setButtonActive({
      ...buttonActive,
      [type]: value !== undefined ? value : !buttonActive[type]
    });
  };

  const shareCard = () => {
    // Create invisible element with text
    copyCardUrl(id);
    toggleActiveButton(BUTTON_TYPE.SHARE);
  };

  const getActions = () => {
    const actions = [
      {
        label: 'Share Card',
        buttonType: BUTTON_TYPE.SHARE,
        onClick: () => shareCard()
      }
    ];

    return actions;
  };

  const protectedOnClick = (onClick, buttonType) => {
    if (onClick) {
      onClick();
    } else {
      toggleActiveButton(buttonType);
    }

    setDropdownOpen(false);
  };

  const renderDropdown = () => {
    if (!showMoreMenu) {
      return null;
    }

    const actions = getActions();

    return (
      <div className={s('flex-shrink-0 relative')}>
        <Dropdown
          isOpen={dropdownOpen}
          toggler={<MdMoreHoriz />}
          onToggle={setDropdownOpen}
          body={
            <div className={s('suggestion-card-dropdown')}>
              {actions.map(({ label, onClick, buttonType }, i) => (
                <div key={buttonType}>
                  <Button
                    key={label}
                    text={label}
                    className={s('shadow-none text-purple-reg')}
                    onClick={() => protectedOnClick(onClick, buttonType)}
                  />
                  {i !== actions.length - 1 && <Separator horizontal className={s('my-0')} />}
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  };

  const renderShareSuccess = () => {
    return (
      <Message
        message={
          <div
            className={s(
              'flex-1 mt-sm mx-sm p-sm text-center bg-purple-light rounded-full text-xs'
            )}
          >
            Copied link to clipboard!
          </div>
        }
        show={buttonActive[BUTTON_TYPE.SHARE]}
        onHide={() => toggleActiveButton(BUTTON_TYPE.SHARE)}
        animate
        temporary
      />
    );
  };

  const renderModals = () => {
    const actions = getActions();

    return (
      <div>
        {actions
          .filter(({ modalProps }) => !!modalProps)
          .map(({ modalProps, buttonType }) => (
            <div key={buttonType}>
              <ConfirmModal
                isOpen={buttonActive[buttonType]}
                onRequestClose={() => toggleActiveButton(buttonType)}
                {...modalProps}
              />
            </div>
          ))}
      </div>
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
    trackEvent('Open Card from Search', { 'Card ID': id, Question: question, Status: status });
    openCard({ _id: id });
  };

  const render = () => {
    const { question: highlightQuestion, answer: highlightAnswer } = highlight;

    const displayedQuestion = highlightQuestion
      ? replaceHighlightTags(highlightQuestion)
      : question;

    let displayedAnswer = highlightAnswer && replaceHighlightTags(highlightAnswer);
    if (!displayedAnswer) {
      displayedAnswer = externalLinkAnswer ? externalLinkAnswer.link : answer;
    }

    return (
      <div className={s(`${className} suggestion-elem`)} onClick={clickOpenCard}>
        <div className={s('flex justify-between')}>
          <CardLocation
            finderNode={finderNode}
            className={s('min-w-0')}
            pathClassName={s('suggestion-elem-path')}
            maxPathLength={3}
          />
          <CardStatusIndicator status={status} className={s('self-end')} />
          {renderDropdown()}
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
        {renderModals()}
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
  highlight: PropTypes.shape({
    question: PropTypes.arrayOf(PropTypes.string),
    answer: PropTypes.arrayOf(PropTypes.string)
  }),
  showAnswer: PropTypes.bool,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  finderNode: NodePropTypes,
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
