import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import Switch from 'react-switch';
import { MdKeyboardArrowUp } from 'react-icons/md';

import { INTEGRATIONS_MAP, INTEGRATIONS } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';

import ExternalResult from '../ExternalResult';
import ExternalResultHeader from '../ExternalResultHeader';

import getItemProps from './ExternalResultProps';
import style from './external-result-section.css';

const s = getStyleApplicationFn(style);

const DEFAULT_NUM_EXT_RESULTS_SHOWN = 4;

export const SWITCH_PROPS = {
  width: 35,
  height: 17,
  checkedIcon: false,
  uncheckedIcon: false
};

const ExternalResultSection = ({
  integrationType,
  items,
  integrationSettings,
  requestUpdateUser
}) => {
  const [isExpanded, setExpanded] = useState(false);

  const renderResult = (result) => {
    const resultProps = getItemProps(integrationType, result);
    const { id, logo, url, title, body, showDropdown, timestamp, highlightTags } = resultProps;
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
        timestamp={timestamp}
        highlightTags={highlightTags}
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
              <Switch
                {...SWITCH_PROPS}
                checked={!isIntegrationDisabled}
                onChange={(checked) => toggleSettings(checked)}
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
