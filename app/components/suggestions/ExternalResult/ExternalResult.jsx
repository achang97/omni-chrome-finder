import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Timeago, Message } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { createHighlightedElement } from 'utils/search';
import { USER, SEGMENT, URL_REGEX } from 'appConstants';

import style from './external-result.css';
import sharedStyle from '../styles/external-result.css';

import SuggestionDropdown from '../SuggestionDropdown';

const s = getStyleApplicationFn(style, sharedStyle);

const ExternalResult = ({
  id,
  url,
  type,
  logo,
  title,
  timestamp,
  body,
  bodyClassName,
  card,
  showDropdown,
  highlightTags,
  isEditor,
  openCard,
  updateExternalLinkAnswer,
  toggleExternalCreateModal,
  updateExternalTitle,
  updateExternalResultId,
  requestLogAudit,
  trackEvent
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
    trackEvent(SEGMENT.EVENT.OPEN_EXTERNAL_DOC, { Type: type, Title: title }, true);
    requestLogAudit(USER.AUDIT.TYPE.OPEN_EXTERNAL_DOC, { type, title });
    window.open(url, '_blank');
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
    ACTIONS = [
      {
        label: 'Verify with Omni',
        onClick: () => {
          toggleExternalCreateModal();
          updateExternalTitle(title);
          updateExternalResultId(id);

          const { getLinks, regex } = URL_REGEX.EXTERNAL_VERIFICATION[type];
          const links = getLinks(url.match(regex));
          updateExternalLinkAnswer({ type, ...links });
        }
      }
    ];
  }

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
          {title && (
            <div className={s('external-result-text')}>
              {highlightTags ? createHighlightedElement(title, highlightTags) : title}
            </div>
          )}
          <div
            className={s(`external-result-description ${title ? 'mt-xs' : ''} ${bodyClassName}`)}
          >
            {body}
          </div>
        </div>
        <div className={s('flex self-start')}>
          {card && <CardStatusIndicator status={card.status} />}
          {showDropdown && <SuggestionDropdown actions={ACTIONS} />}
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
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  logo: PropTypes.node,
  title: PropTypes.string,
  timestamp: PropTypes.string,
  body: PropTypes.node,
  bodyClassName: PropTypes.string,
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }),
  showDropdown: PropTypes.bool,
  highlightTags: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),

  // Redux State
  isEditor: PropTypes.bool.isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  updateExternalLinkAnswer: PropTypes.func.isRequired,
  toggleExternalCreateModal: PropTypes.func.isRequired,
  updateExternalTitle: PropTypes.func.isRequired,
  updateExternalResultId: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

ExternalResult.defaultProps = {
  bodyClassName: '',
  showDropdown: true
};

export default ExternalResult;
