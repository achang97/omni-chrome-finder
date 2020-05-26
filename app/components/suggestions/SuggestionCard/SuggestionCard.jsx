import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreHoriz } from 'react-icons/md';

import { CardStatusIndicator, CardLocation } from 'components/cards';
import { Button, Dropdown, Message, Loader, Separator, ConfirmModal } from 'components/common';

import { CARD, INTEGRATION_IMAGES } from 'appConstants';
import { copyCardUrl } from 'utils/card';
import { NodePropTypes } from 'utils/propTypes';

import { getStyleApplicationFn } from 'utils/style';
import cardStyle from './suggestion-card.css';
import mainStyle from '../suggestion.css';

const s = getStyleApplicationFn(mainStyle, cardStyle);

const BUTTON_TYPE = {
  SHARE: 'SHARE',
  DELETE: 'DELETE'
};

const SuggestionCard = ({
  id,
  question,
  maxQuestionLines,
  answer,
  externalLinkAnswer,
  showAnswer,
  status,
  finderNode,
  className,
  showMoreMenu,
  deleteProps,
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

  const { isLoading: isDeleting, error: deleteError } = deleteProps || {};
  useEffect(() => {
    if (!isDeleting && !deleteError) {
      toggleActiveButton(BUTTON_TYPE.DELETE, false);
    }
  }, [isDeleting]);

  const getButtonProps = ({ isLoading, onClick }) => {
    return {
      onClick: () => onClick(id),
      iconLeft: false,
      icon: isLoading ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null,
      disabled: isLoading
    };
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

    if (deleteProps) {
      actions.push({
        label: 'Delete Card',
        buttonType: BUTTON_TYPE.DELETE,
        modalProps: {
          title: 'Confirm Delete Card',
          description: 'Are you sure you want to delete this card?',
          error: deleteProps.error,
          primaryButtonProps: {
            text: 'Delete',
            ...getButtonProps(deleteProps)
          }
        }
      });
    }

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
            <div className={s('navigate-more-dropdown')}>
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
    const logo = INTEGRATION_IMAGES[externalLinkAnswer.type];
    return (
      <img src={logo} alt={externalLinkAnswer.type} className={s('mt-xs ml-xs w-reg h-reg')} />
    );
  };

  const clickOpenCard = () => {
    trackEvent('Open Card from Search', { 'Card ID': id, Question: question, Status: status });
    openCard({ _id: id });
  };

  return (
    <div className={s(`${className} suggestion-elem`)} onClick={clickOpenCard}>
      <div className={s('flex justify-between mb-xs')}>
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
            {question}
          </span>
          {externalLinkAnswer && renderExternalLogo()}
        </div>
        {showAnswer && (answer || externalLinkAnswer) && (
          <span
            className={s(
              'mt-sm text-xs text-gray-dark font-medium line-clamp-2 break-words wb-break-words'
            )}
          >
            {externalLinkAnswer ? externalLinkAnswer.link : answer}
          </span>
        )}
      </div>
      {renderShareSuccess()}
      {renderModals()}
    </div>
  );
};

SuggestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  maxQuestionLines: PropTypes.number,
  answer: PropTypes.string,
  externalLinkAnswer: PropTypes.shape({
    link: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }),
  showAnswer: PropTypes.bool,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  finderNode: NodePropTypes,
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,
  deleteProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string
  }),

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionCard.defaultProps = {
  className: '',
  maxQuestionLines: 2,
  showAnswer: true,
  showMoreMenu: false,
  deleteProps: null
};

export default SuggestionCard;
