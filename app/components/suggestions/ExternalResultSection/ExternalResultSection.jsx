import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import Toggle from 'react-toggle';
import { MdKeyboardArrowUp, MdThumbUp, MdThumbDown } from 'react-icons/md';

import { INTEGRATIONS_MAP, INTEGRATIONS } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';

import ExternalResult from '../ExternalResult';
import ExternalResultHeader from '../ExternalResultHeader';

const s = getStyleApplicationFn();

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DEFAULT_NUM_EXT_RESULTS_SHOWN = 4;

const getItemProps = (type, item) => {
  const baseProps = {
    logo: INTEGRATIONS_MAP[type].logo,
    showDropdown: true
  };

  switch (type) {
    case INTEGRATIONS.GOOGLE.type: {
      const { id, webViewLink, iconLink, name, owners, mimeType } = item;
      return {
        ...baseProps,
        logo: iconLink,
        id,
        url: webViewLink,
        title: name,
        showDropdown: mimeType !== FOLDER_MIME_TYPE,
        body: owners.length !== 0 && (
          <>
            {owners.map(({ displayName, permissionId, me }, i) => (
              <React.Fragment key={permissionId}>
                <span>{me ? 'You' : displayName}</span>
                {i !== owners.length - 1 && <span>, </span>}
              </React.Fragment>
            ))}
          </>
        )
      };
    }
    case INTEGRATIONS.ZENDESK.type: {
      const { id, html_url: htmlUrl, title, voteSum, author, promoted, draft } = item;
      return {
        ...baseProps,
        id,
        url: htmlUrl,
        title,
        body: (
          <div className={s('flex items-center')}>
            <div
              className={s(`
                flex items-center mr-sm
                ${voteSum > 0 ? 'text-green-500' : ''}
                ${voteSum < 0 ? 'text-red-500' : ''}
              `)}
            >
              {voteSum >= 0 ? <MdThumbUp /> : <MdThumbDown />}
              <div className={s('ml-xs')}> {voteSum} </div>
            </div>
            {author && <div className={s('mr-reg')}>{author.name}</div>}
            {promoted && <div className={s('italic mr-sm')}> Promoted </div>}
            {draft && <div className={s('italic mr-sm')}> Draft </div>}
          </div>
        )
      };
    }
    case INTEGRATIONS.CONFLUENCE.type: {
      const { id, url, title } = item;
      return { ...baseProps, id, url, title };
    }
    case INTEGRATIONS.JIRA.type: {
      const { id, url, title } = item;
      return { ...baseProps, id, url, title, showDropdown: false };
    }
    default:
      return {};
  }
};

const ExternalResultSection = ({
  integrationType,
  items,
  integrationSettings,
  requestUpdateUser
}) => {
  const [isExpanded, setExpanded] = useState(false);

  const renderResult = (result) => {
    const { id, logo, url, title, body, showDropdown } = getItemProps(integrationType, result);
    const { card } = result;

    return (
      <ExternalResult
        key={id}
        id={id}
        type={integrationType}
        logo={logo}
        url={url}
        title={title}
        card={card}
        body={body}
        showDropdown={showDropdown}
      />
    );
  };

  const toggleSettings = (isEnabled) => {
    requestUpdateUser({
      [`widgetSettings.integrationSearch.${integrationType}.disabled`]: !isEnabled
    });
  };

  const renderSection = () => {
    const { logo, title } = INTEGRATIONS_MAP[integrationType];
    const isIntegrationDisabled = integrationSettings[integrationType].disabled;

    if (items.length === 0) {
      return null;
    }

    return (
      <div>
        <ExternalResultHeader
          title={title}
          logo={logo}
          numItems={items.length}
          headerEnd={
            <div className={s('flex items-center')}>
              <Toggle
                checked={!isIntegrationDisabled}
                icons={false}
                onChange={(e) => toggleSettings(e.target.checked)}
              />
              {isExpanded && (
                <MdKeyboardArrowUp
                  className={s('cursor-pointer ml-sm')}
                  onClick={() => setExpanded(false)}
                />
              )}
            </div>
          }
        />
        <div className={s('px-lg')}>
          <AnimateHeight height={isIntegrationDisabled ? 0 : 'auto'}>
            {items.slice(0, DEFAULT_NUM_EXT_RESULTS_SHOWN).map(renderResult)}
          </AnimateHeight>
          {items.length > DEFAULT_NUM_EXT_RESULTS_SHOWN && !isExpanded && !isIntegrationDisabled && (
            <div
              className={s(
                'cursor-pointer text-center p-sm my-sm text-xs bg-white shadow-md rounded-lg text-gray-dark'
              )}
              onClick={() => setExpanded(true)}
            >
              View More ({items.length - DEFAULT_NUM_EXT_RESULTS_SHOWN})
            </div>
          )}
          <AnimateHeight height={isExpanded ? 'auto' : 0}>
            {items.slice(DEFAULT_NUM_EXT_RESULTS_SHOWN).map(renderResult)}
          </AnimateHeight>
        </div>
      </div>
    );
  };

  return renderSection();
};

const INTEGRATIONS_ENUM = Object.values(INTEGRATIONS).map(({ type }) => type);

ExternalResultSection.propTypes = {
  integrationType: PropTypes.oneOf(INTEGRATIONS_ENUM).isRequired,
  items: PropTypes.arrayOf(
    // Can vary
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),

  // Redux State
  integrationSettings: PropTypes.objectOf(
    PropTypes.shape({
      disabled: PropTypes.bool.isRequired
    })
  ),

  // Redux Actions
  requestUpdateUser: PropTypes.func.isRequired
};

export default ExternalResultSection;
