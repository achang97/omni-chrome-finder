import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreVert } from 'react-icons/md';

import { CardStatus, CardConfirmModal } from 'components/cards';
import { Button, Dropdown, Message, Loader, Timeago, Separator } from 'components/common';

import { CARD } from 'appConstants';
import { copyCardUrl } from 'utils/card';

import { getStyleApplicationFn } from 'utils/style';
import style from './suggestion-card.css';

const s = getStyleApplicationFn(style);

const BUTTON_TYPE = {
  SHARE: 'SHARE',
  DELETE: 'DELETE'
};

const SuggestionCard = ({
  id,
  question,
  answer,
  updatedAt,
  status,
  className,
  showMoreMenu,
  deleteProps,
  openCard
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonActive, setButtonActive] = useState(_.mapValues(BUTTON_TYPE, () => false));

  const toggleActiveButton = (type, value) => {
    setButtonActive({
      ...buttonActive,
      [type]: value !== undefined ? value : !buttonActive[type]
    });
  };

  if (deleteProps) {
    const isDeleting = deleteProps.isLoading;
    useEffect(() => {
      if (!isDeleting && !deleteProps.error) {
        toggleActiveButton(BUTTON_TYPE.DELETE, false);
      }
    }, [isDeleting]);
  }

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
          className={s('ml-xs')}
          isOpen={dropdownOpen}
          toggler={<MdMoreVert />}
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
              <CardConfirmModal
                isOpen={buttonActive[buttonType]}
                onRequestClose={() => toggleActiveButton(buttonType)}
                {...modalProps}
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div
      className={s(`${className} rounded-xl p-lg bg-white cursor-pointer`)}
      onClick={() => openCard({ _id: id })}
    >
      <div className={s('flex flex-col')}>
        <div className={s('flex')}>
          <span className={s('flex-grow text-lg text-left font-semibold break-words line-clamp-3')}>
            {question}
          </span>
          {renderDropdown()}
        </div>
        {answer && (
          <span className={s('mt-sm text-xs text-gray-dark font-medium line-clamp-3 break-words')}>
            {answer}
          </span>
        )}
      </div>
      <div className={s('mt-reg pt-reg flex-col')}>
        <Separator horizontal className={s('mb-sm')} />
        <div className={s('flex items-center justify-between')}>
          <span className={s('block text-center text-xs text-gray-light')}>
            <Timeago date={updatedAt} live={false} />
          </span>
          <CardStatus status={status} />
        </div>
      </div>
      {renderShareSuccess()}
      {renderModals()}
    </div>
  );
};

SuggestionCard.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  className: PropTypes.string,
  showMoreMenu: PropTypes.bool,
  deleteProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string
  }),

  // Redux Actions
  openCard: PropTypes.func.isRequired
};

SuggestionCard.defaultProps = {
  className: '',
  showMoreMenu: false,
  deleteProps: null
};

export default SuggestionCard;
