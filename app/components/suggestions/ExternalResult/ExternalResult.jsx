import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Timeago, Message } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { createHighlightedElement } from 'utils/search';
import { URL_REGEX, CARD } from 'appConstants';

import style from './external-result.css';
import sharedStyle from '../styles/external-result.css';

import SuggestionDropdown from '../SuggestionDropdown';

const s = getStyleApplicationFn(style, sharedStyle);

const ExternalResult = ({
  url,
  searchLogId,
  type,
  logo,
  timestamp,
  showTitle,
  body,
  bodyClassName,
  card,
  commonProps,
  isEditor,
  openCard,
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId
}) => {
  const [showShare, setShowShare] = useState(false);

  const shareCard = () => {
    // Create invisible element with text
    copyText(url);
    setShowShare(true);
  };

  const renderShareSuccess = () => {
    return (
      <Message
        message={<div className={s('suggestion-share bg-white')}>Copied link to clipboard!</div>}
        show={showShare}
        onHide={() => setShowShare(false)}
        animate
        temporary
      />
    );
  };

  const onResultClick = () => {
    window.open(`${url}&baseLogId=${searchLogId}`, '_blank');
  };

  let ACTIONS = [];
  if (card) {
    ACTIONS = [
      {
        label: 'Copy Link',
        onClick: shareCard
      },
      {
        label: 'Open Omni Card',
        onClick: () => openCard({ _id: card._id })
      }
    ];
  } else if (isEditor) {
    const regexInfo = URL_REGEX.EXTERNAL_VERIFICATION[type];
    const match = regexInfo && commonProps.url.match(regexInfo.regex);

    if (match) {
      const links = regexInfo.getLinks(match);
      ACTIONS = [
        {
          label: 'Verify with Omni',
          onClick: () => {
            toggleExternalCreateModal();
            updateExternalTitle(commonProps.parsedTitle);
            updateExternalResultId(commonProps.id);

            updateExternalLinkAnswer({ type, ...links });
          }
        }
      ];
    }
  }

  const shouldDisplayTitle = showTitle && commonProps.title;
  return (
    <div className={s('external-result flex-col cursor-pointer')} onClick={onResultClick}>
      <div className={s('flex items-center')}>
        {logo &&
          (typeof logo === 'string' ? (
            <div className={s('external-result-icon')}>
              <img src={logo} alt="" />
            </div>
          ) : (
            logo
          ))}
        <div className={s(`min-w-0 flex-1 flex flex-col ${logo ? 'ml-sm' : ''}`)}>
          {shouldDisplayTitle && (
            <div className={s('external-result-text')}>
              {createHighlightedElement(commonProps.title, commonProps.highlightTags)}
            </div>
          )}
          <div
            className={s(`
              external-result-description
              ${shouldDisplayTitle ? 'mt-xs' : ''} ${bodyClassName}
            `)}
          >
            {body}
          </div>
        </div>
        <div className={s('flex self-start')}>
          {card && <CardStatusIndicator status={card.status} />}
          <SuggestionDropdown actions={ACTIONS} />
        </div>
      </div>
      {timestamp && (
        <Timeago
          date={timestamp}
          live={false}
          className={s('external-result-description mt-xs flex justify-end')}
        />
      )}
      {renderShareSuccess()}
    </div>
  );
};

ExternalResult.propTypes = {
  url: PropTypes.string.isRequired,
  searchLogId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  logo: PropTypes.node,
  showTitle: PropTypes.bool,
  timestamp: PropTypes.string,
  body: PropTypes.node,
  bodyClassName: PropTypes.string,
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired
  }),
  commonProps: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    parsedTitle: PropTypes.string,
    highlightTags: PropTypes.arrayOf(PropTypes.string)
  }),

  // Redux State
  isEditor: PropTypes.bool.isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  updateExternalLinkAnswer: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  updateExternalTitle: PropTypes.func.isRequired,
  updateExternalResultId: PropTypes.func.isRequired
};

ExternalResult.defaultProps = {
  bodyClassName: '',
  showTitle: true,
  commonProps: {}
};

export default ExternalResult;
