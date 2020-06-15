import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { MdClose, MdKeyboardArrowUp, MdKeyboardArrowLeft } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { Button, Triangle, Separator } from 'components/common';

import { colors } from 'styles/colors';
import { SEARCH, INTEGRATIONS, INTEGRATIONS_MAP, ANIMATE, PROFILE } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';
import mainStyle from './suggestion-panel.css';
import externalIconStyle from '../ExternalResults/ExternalResult/external-result.css';

import { GoogleResult, ZendeskResult, ConfluenceResult } from '../ExternalResults';
import SuggestionScrollContainer from '../SuggestionScrollContainer';

const s = getStyleApplicationFn(mainStyle, externalIconStyle);

const DEFAULT_NUM_EXT_RESULTS_SHOWN = 4;

const VALID_INTEGRATIONS = [
  INTEGRATIONS.GOOGLE.type,
  INTEGRATIONS.ZENDESK.type,
  INTEGRATIONS.CONFLUENCE.type
];

const SuggestionPanel = ({
  query,
  shouldSearchNodes,
  shouldSearchIntegrations,
  cards,
  isSearchingCards,
  hasReachedLimit,
  nodes,
  isSearchingNodes,
  dockVisible,
  integrationResults,
  isSearchingIntegrations,
  requestSearchCards,
  clearSearchCards,
  requestSearchNodes,
  requestSearchIntegrations,
  requestLogAudit,
  trackEvent
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showIntegrationResults, setShowIntegrationResults] = useState(true);
  const [showIntegration, setShowIntegration] = useState({});

  const integrationResultsRef = useRef(null);

  const searchCards = (clearCards) => {
    requestSearchCards(SEARCH.SOURCE.DOCK, { q: query }, clearCards);

    if (clearCards) {
      if (shouldSearchNodes) {
        requestSearchNodes(query);
      }

      if (shouldSearchIntegrations) {
        requestSearchIntegrations(query);
      }
    }
  };

  const [debouncedRequestSearch] = useDebouncedCallback(() => {
    searchCards(true);
  }, ANIMATE.DEBOUNCE.MS_300);

  useEffect(() => {
    if (query === '') {
      clearSearchCards(SEARCH.SOURCE.DOCK);
    } else {
      debouncedRequestSearch();
    }
  }, [query, clearSearchCards, debouncedRequestSearch]);

  const toggleIntegration = (integration) => {
    setShowIntegration({
      ...showIntegration,
      [integration]: !showIntegration[integration]
    });
  };

  const renderExternalSourceResults = (externalSource) => {
    const { type, items } = externalSource;
    const { logo, title } = INTEGRATIONS_MAP[type];

    const logClick = (result) => {
      trackEvent(`Open External Document - ${title}`, { Type: type, Title: title });
      trackEvent(`Retention Event`, { type: 'Open External Document' });
      requestLogAudit(PROFILE.AUDIT_TYPE.OPEN_EXTERNAL_DOC, { type, ...result });
    };

    let ResultComponent;
    switch (type) {
      case INTEGRATIONS.GOOGLE.type: {
        ResultComponent = GoogleResult;
        break;
      }
      case INTEGRATIONS.ZENDESK.type: {
        ResultComponent = ZendeskResult;
        break;
      }
      case INTEGRATIONS.CONFLUENCE.type: {
        ResultComponent = ConfluenceResult;
        break;
      }
      default:
        return null;
    }

    const renderResult = (result) => (
      <ResultComponent
        key={ResultComponent.getKey ? ResultComponent.getKey(result) : result.id}
        onClick={() => logClick(result)}
        {...result}
      />
    );

    const isFullyExpanded = showIntegration[type];
    return (
      <div key={type}>
        <div className={s('flex items-center justify-between px-reg pt-xs pb-sm mb-xs')}>
          <div className={s('flex items-center text-sm text-gray-dark')}>
            <div className={s('external-result-icon mr-sm')}>
              <img src={logo} alt={title} />
            </div>
            <span className={s('font-semibold mr-sm')}> {title} </span>
            <span> ({items.length}) </span>
          </div>
          {isFullyExpanded && (
            <MdKeyboardArrowUp
              className={s('cursor-pointer')}
              onClick={() => toggleIntegration(type)}
            />
          )}
        </div>
        <div className={s('px-lg')}>
          {items.slice(0, DEFAULT_NUM_EXT_RESULTS_SHOWN).map(renderResult)}
          {items.length > DEFAULT_NUM_EXT_RESULTS_SHOWN && (
            <AnimateHeight height={isFullyExpanded ? 0 : 'auto'}>
              <div
                className={s(
                  'cursor-pointer text-center p-sm my-sm text-xs bg-white shadow-md rounded-lg text-gray-dark'
                )}
                onClick={() => toggleIntegration(type)}
              >
                View More ({items.length - DEFAULT_NUM_EXT_RESULTS_SHOWN})
              </div>
            </AnimateHeight>
          )}
          <AnimateHeight height={isFullyExpanded ? 'auto' : 0}>
            {items.slice(DEFAULT_NUM_EXT_RESULTS_SHOWN).map(renderResult)}
          </AnimateHeight>
        </div>
      </div>
    );
  };

  const countIntegrationResults = () => {
    let numIntegrationResults = 0;
    integrationResults.forEach(({ type, items }) => {
      if (VALID_INTEGRATIONS.includes(type)) {
        numIntegrationResults += items.length;
      }
    });
    return numIntegrationResults;
  };

  const renderExternalDocumentationResults = () => {
    const numIntegrationResults = countIntegrationResults();
    if (numIntegrationResults === 0 || !shouldSearchIntegrations || isSearchingIntegrations) {
      // AnimateHeight expects children prop
      return <div />;
    }

    return (
      <div className={s('flex-col justify-center items-center')} ref={integrationResultsRef}>
        {cards.length !== 0 && <Separator horizontal className={s('my-xs')} />}
        <div className={s('flex justify-between items-center p-sm px-lg')}>
          <div className={s('text-purple-reg font-semibold text-sm')}>
            Found in your documentation ({numIntegrationResults})
          </div>
          <MdClose
            className={s('button-hover')}
            color={colors.purple['gray-50']}
            onClick={() => setShowIntegrationResults(false)}
          />
        </div>
        {integrationResults.map(renderExternalSourceResults)}
      </div>
    );
  };

  const renderFooter = () => {
    const numIntegrationResults = countIntegrationResults();

    if (numIntegrationResults === 0) {
      return null;
    }

    return (
      <div className={s('suggestion-panel-footer')}>
        <Button
          text={`Found in your documentation ${
            numIntegrationResults !== 0 ? `(${numIntegrationResults})` : ''
          }`}
          underline
          onClick={() => setShowIntegrationResults(true)}
          color="transparent"
          textClassName={s('text-sm')}
          className={s('self-stretch rounded-none shadow-none py-sm')}
        />
      </div>
    );
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const numIntegrationResults = countIntegrationResults();
  const showMainPanel = isVisible && query.length !== 0 && dockVisible;

  const isLoading =
    isSearchingCards ||
    (shouldSearchNodes && isSearchingNodes) ||
    (shouldSearchIntegrations && isSearchingIntegrations);

  return (
    <div className={s(`suggestion-panel ${!showMainPanel ? 'border-0' : ''}`)}>
      <AnimateHeight height={showMainPanel ? 'auto' : 0}>
        <div className={s('pt-reg rounded-b-lg')}>
          <div className={s('flex justify-between mb-sm px-reg')}>
            <div className={s('text-purple-gray-50 text-sm')}>
              {cards.length} card{cards.length !== 1 && 's'}
            </div>
            <MdClose className={s('button-hover text-gray-light')} onClick={toggleVisibility} />
          </div>
          <SuggestionScrollContainer
            scrollContainerClassName={s(
              `suggestion-panel-card-container ${
                showIntegrationResults ? 'suggestion-panel-card-container-lg' : ''
              }`
            )}
            cards={cards}
            nodes={shouldSearchNodes ? nodes : []}
            isSearching={isLoading}
            showPlaceholder={!showIntegrationResults || numIntegrationResults === 0}
            triangleColor={colors.purple.light}
            onBottom={() => searchCards(false)}
            hasReachedLimit={hasReachedLimit}
            footer={
              <AnimateHeight
                height={showIntegrationResults ? 'auto' : 0}
                onAnimationEnd={({ newHeight }) =>
                  newHeight !== 0 &&
                  integrationResultsRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {renderExternalDocumentationResults()}
              </AnimateHeight>
            }
          />
          {!showIntegrationResults && renderFooter()}
        </div>
      </AnimateHeight>
      {showMainPanel && (
        <div className={s('suggestion-panel-arrow-container justify-end')}>
          <Triangle
            size={10}
            color="white"
            direction="left"
            className={s('suggestion-panel-arrow')}
            outlineSize={1}
            outlineColor={colors.gray.light}
          />
        </div>
      )}
      {!isVisible && query.length !== 0 && (
        <div
          className={s('suggestion-panel-arrow-container suggestion-panel-toggle')}
          onClick={toggleVisibility}
        >
          <MdKeyboardArrowLeft />
        </div>
      )}
    </div>
  );
};

SuggestionPanel.propTypes = {
  query: PropTypes.string.isRequired,
  shouldSearchNodes: PropTypes.bool,
  shouldSearchIntegrations: PropTypes.bool,

  // Redux State
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSearchingCards: PropTypes.bool,
  hasReachedLimit: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(NodePropTypes).isRequired,
  isSearchingNodes: PropTypes.bool,
  integrationResults: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      items: PropTypes.array
    })
  ).isRequired,
  isSearchingIntegrations: PropTypes.bool,
  dockVisible: PropTypes.bool.isRequired,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestSearchNodes: PropTypes.func.isRequired,
  requestSearchIntegrations: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionPanel.defaultProps = {
  shouldSearchNodes: false,
  shouldSearchIntegrations: false
};

export default SuggestionPanel;
