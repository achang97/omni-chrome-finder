import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Timeago, Message } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { copyCardUrl } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

import style from './external-result.css';

import SuggestionDropdown from '../../SuggestionDropdown';

const s = getStyleApplicationFn(style);

const ExternalResult = ({
  url,
  onClick,
  logo,
  title,
  timestamp,
  body,
  bodyClassName,
  card,
  openCard
}) => {
  const [showShare, setShowShare] = useState(false);

  const shareCard = () => {
    // Create invisible element with text
    copyCardUrl(card._id);
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
    onClick();
    window.open(url, '_blank');
  };

  const ACTIONS = [
    {
      label: 'Copy Link',
      onClick: shareCard
    },
    {
      label: 'Open Omni Card',
      onClick: () => openCard({ _id: card._id })
    }
  ];

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
        {card && (
          <div className={s('flex self-start')}>
            <CardStatusIndicator status={card.status} />
            <SuggestionDropdown actions={ACTIONS} />
          </div>
        )}
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
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
  body: PropTypes.node,
  bodyClassName: PropTypes.string,
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired
};

ExternalResult.defaultProps = {
  bodyClassName: ''
};

export default ExternalResult;
