import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { MdClose, MdKeyboardArrowLeft, MdAddCircle } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';
import Switch from 'react-switch';

import { Button, Triangle, Separator, Loader } from 'components/common';

import { colors } from 'styles/colors';
import { SEARCH, ANIMATE, SEGMENT, INTEGRATIONS, ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import { isLoggedIn } from 'utils/auth';
import { NodePropTypes, UserPropTypes } from 'utils/propTypes';
import mainStyle from './suggestion-panel.css';
import scrollStyle from '../SuggestionScrollContainer/suggestion-scroll-container.css';

import SuggestionScrollContainer from '../SuggestionScrollContainer';
import ExternalResultSection, { SWITCH_PROPS } from '../ExternalResultSection';
import ExternalResultHeader from '../ExternalResultHeader';

const s = getStyleApplicationFn(mainStyle, scrollStyle);

const SEARCH_INTEGRATIONS = [
  INTEGRATIONS.CONFLUENCE,
  INTEGRATIONS.GOOGLE,
  INTEGRATIONS.JIRA,
  INTEGRATIONS.ZENDESK
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
  hasSearchedIntegrations,
  user,
  requestSearchCards,
  clearSearchCards,
  requestSearchNodes,
  requestSearchIntegrations,
  openCard,
  requestUpdateUser,
  trackEvent,
  history
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showIntegrationResults, setShowIntegrationResults] = useState(true);

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

  const countIntegrationResults = () => {
    let numIntegrationResults = 0;
    integrationResults.forEach(({ items }) => {
      numIntegrationResults += items.length;
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
        {integrationResults.map(({ type, items }) => (
          <ExternalResultSection key={type} integrationType={type} items={items} />
        ))}
      </div>
    );
  };

  const clickCreateCard = () => {
    trackEvent(SEGMENT.EVENT.CLICK_CREATE_CARD_FROM_SEARCH, { Question: query });
    openCard({ question: query }, true);
  };

  const renderDisconnectedIntegrations = () => {
    if (isSearchingIntegrations || !hasSearchedIntegrations) {
      return null;
    }

    const isSearchEnabled = (type) => !user.widgetSettings.integrationSearch[type].disabled;

    /* eslint-disable react/display-name */
    const DISCONNECTED_INTEGRATIONS = [
      {
        isShown: ({ type }) =>
          isLoggedIn(user, type) &&
          (!isSearchEnabled(type) || integrationResults.every((result) => result.type !== type)),
        getHeaderEnd: (type) => (
          <Switch
            {...SWITCH_PROPS}
            checked={isSearchEnabled(type)}
            icons={false}
            onChange={(e) => {
              requestUpdateUser({
                [`widgetSettings.integrationSearch.${type}.disabled`]: !e.target.checked
              });
            }}
          />
        )
      },
      {
        isShown: ({ type }) => !isLoggedIn(user, type),
        getHeaderEnd: () => (
          <Button
            text="Sign in"
            color="transparent"
            className={s('py-xs')}
            textClassName={s('text-xs')}
            onClick={() => history.push(ROUTES.PROFILE)}
          />
        )
      }
    ];
    /* eslint-enable react/display-name */

    return (
      <>
        <Separator horizontal className={s('w-5/6')} />
        <div className={s('text-gray-light my-sm text-xs px-reg')}> Disabled Integrations </div>
        {DISCONNECTED_INTEGRATIONS.map(({ isShown, getHeaderEnd }) =>
          SEARCH_INTEGRATIONS.filter(isShown).map(({ type, logo, title }) => (
            <ExternalResultHeader
              key={type}
              logo={logo}
              title={title}
              headerEnd={getHeaderEnd(type)}
            />
          ))
        )}
      </>
    );
  };

  const renderScrollContainerFooter = (isLoading) => {
    return (
      <>
        {!isSearchingCards && (
          <div
            className={s(
              'suggestion-create-card suggestion-scroll-container-card flex items-center'
            )}
            onClick={() => clickCreateCard()}
          >
            <MdAddCircle className={s('text-purple-gray-50 mr-xs')} />
            <span className={s('text-sm font-bold')}>Create a card for &ldquo;{query}&rdquo;</span>
          </div>
        )}
        {!isLoading && shouldSearchIntegrations && isSearchingIntegrations && (
          <Loader size="sm" className={s('my-sm')} />
        )}
        <AnimateHeight
          height={showIntegrationResults ? 'auto' : 0}
          onAnimationEnd={({ newHeight }) =>
            newHeight !== 0 && integrationResultsRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        >
          {renderExternalDocumentationResults()}
          {renderDisconnectedIntegrations()}
        </AnimateHeight>
      </>
    );
  };

  const renderPanelFooter = () => {
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

  const showMainPanel = isVisible && query.length !== 0 && dockVisible;

  const isLoading = isSearchingCards || (shouldSearchNodes && isSearchingNodes);
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
            triangleColor={colors.purple.light}
            onBottom={() => searchCards(false)}
            hasReachedLimit={hasReachedLimit}
            showPlaceholder={false}
            footer={renderScrollContainerFooter(isLoading)}
          />
          {!showIntegrationResults && renderPanelFooter()}
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
  hasSearchedIntegrations: PropTypes.bool,
  dockVisible: PropTypes.bool.isRequired,
  user: UserPropTypes.isRequired,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestSearchNodes: PropTypes.func.isRequired,
  requestSearchIntegrations: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

SuggestionPanel.defaultProps = {
  shouldSearchNodes: false,
  shouldSearchIntegrations: false
};

export default SuggestionPanel;
