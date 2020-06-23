import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Timeago, Message } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { PROFILE, SEGMENT, URL_REGEX } from 'appConstants';

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
    requestLogAudit(PROFILE.AUDIT.TYPE.OPEN_EXTERNAL_DOC, { type, title });
    window.open(url, '_blank');
  };

  let ACTIONS;
  if (!card) {
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
  } else {
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
  }

  return (
    <div className={s('external-result flex-col cursor-pointer')} onClick={onResultClick}>
      <div className={s('flex items-center')}>
        <div className={s('external-result-icon')}>
          <img src={logo} alt="" />
        </div>
        <div className={s('min-w-0 flex-1 ml-sm flex flex-col')}>
          <div className={s('external-result-text')}> {title} </div>
          <div className={s(`external-result-description ${bodyClassName}`)}>{body}</div>
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
          className={s('external-result-description flex justify-end')}
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
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
  body: PropTypes.node,
  bodyClassName: PropTypes.string,
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }),
  showDropdown: PropTypes.bool,

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
