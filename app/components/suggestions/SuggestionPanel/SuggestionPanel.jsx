import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import {
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardArrowLeft
} from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { Button, Triangle, Separator } from 'components/common';

import { colors } from 'styles/colors';
import { SEARCH, INTEGRATIONS, ANIMATE, PROFILE } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import mainStyle from './suggestion-panel.css';
import externalIconStyle from '../ExternalResults/external-results.css';

import { SlackResult, GoogleResult, ZendeskResult, GmailResult } from '../ExternalResults';
import SuggestionScrollContainer from '../SuggestionScrollContainer';

const s = getStyleApplicationFn(mainStyle, externalIconStyle);

const SuggestionPanel = ({
  query,
  cards,
  externalResults,
  isSearchingCards,
  hasReachedLimit,
  requestSearchCards,
  clearSearchCards,
  requestLogAudit
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showExternalResults, setShowExternalResults] = useState(true);
  const [showIntegration, setShowIntegration] = useState({});

  const externalResultsRef = useRef(null);

  const searchCards = (clearCards) => {
    requestSearchCards(SEARCH.TYPE.POPOUT, { q: query }, clearCards);
  };

  const [debouncedRequestSearch] = useDebouncedCallback(() => {
    searchCards(true);
  }, ANIMATE.DEBOUNCE.MS_300);

  useEffect(() => {
    if (query === '') {
      clearSearchCards(SEARCH.TYPE.POPOUT);
    } else {
      debouncedRequestSearch();
    }
  }, [query]);

  const toggleIntegration = (integration) => {
    setShowIntegration({
      ...showIntegration,
      [integration]: !showIntegration[integration]
    });
  };

  const renderExternalSourceResults = (externalSource) => {
    const {
      integration: { type, logo, title },
      results
    } = externalSource;

    const onClick = (result) => {
      requestLogAudit(PROFILE.AUDIT_TYPE.OPEN_EXTERNAL_DOC, { type, ...result });
    };

    let ResultComponent;
    switch (type) {
      case INTEGRATIONS.SLACK.type: {
        ResultComponent = SlackResult;
        break;
      }
      case INTEGRATIONS.GOOGLE.type: {
        ResultComponent = GoogleResult;
        break;
      }
      case INTEGRATIONS.ZENDESK.type: {
        ResultComponent = ZendeskResult;
        break;
      }
      case INTEGRATIONS.GMAIL.type: {
        ResultComponent = GmailResult;
        break;
      }
      default:
        break;
    }

    const isOpen = showIntegration[type];
    return (
      <div key={type}>
        <div
          className={s('flex items-center justify-between px-lg py-sm mb-xs cursor-pointer')}
          onClick={() => toggleIntegration(type)}
        >
          <div className={s('flex items-center text-md text-gray-dark')}>
            <div className={s('external-result-icon mr-sm')}>
              <img src={logo} alt={title} />
            </div>
            <span className={s('font-semibold mr-sm')}> {title} </span>
            <span> ({results.length}) </span>
          </div>
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
        <AnimateHeight height={isOpen ? 'auto' : 0}>
          <div className={s('px-lg')}>
            {results.map((result) => (
              <ResultComponent
                key={ResultComponent.getKey(result)}
                logo={logo}
                onClick={() => onClick(result)}
                {...result}
              />
            ))}
          </div>
        </AnimateHeight>
      </div>
    );
  };

  const countExternalResults = () => {
    let numExternalResults = 0;
    externalResults.forEach(({ results }) => {
      numExternalResults += results.length;
    });
    return numExternalResults;
  };

  const renderExternalDocumentationResults = () => {
    const numExternalResults = countExternalResults();
    if (numExternalResults === 0) {
      // AnimateHeight expects children prop
      return <div />;
    }

    return (
      <div className={s('flex-col justify-center items-center')} ref={externalResultsRef}>
        {cards.length !== 0 && <Separator horizontal className={s('my-sm')} />}
        <div className={s('flex justify-between items-center p-lg')}>
          <div className={s('text-purple-reg font-semibold')}>
            Found in your documentation ({numExternalResults})
          </div>
          <MdClose
            className={s('button-hover')}
            color={colors.purple['gray-50']}
            onClick={() => setShowExternalResults(false)}
          />
        </div>
        {externalResults.map(renderExternalSourceResults)}
      </div>
    );
  };

  const renderFooter = () => {
    const numExternalResults = countExternalResults();

    if (numExternalResults === 0) {
      return null;
    }

    return (
      <div
        className={s('suggestion-panel-footer flex-col bg-white justify-center items-center mt-sm')}
      >
        <Button
          text={`Found in your documentation ${
            numExternalResults !== 0 ? `(${numExternalResults})` : ''
          }`}
          underline
          onClick={() => setShowExternalResults(true)}
          color="transparent"
          className={s('self-stretch rounded-none shadow-none py-lg')}
        />
      </div>
    );
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const numExternalResults = countExternalResults();
  const showMainPanel = isVisible && query.length !== 0;
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
            scrollContainerClassName={`suggestion-panel-card-container ${
              showExternalResults ? 'suggestion-panel-card-container-lg' : ''
            }`}
            cards={cards}
            isSearchingCards={isSearchingCards}
            showPlaceholder={!showExternalResults || numExternalResults === 0}
            triangleColor={colors.purple.light}
            onBottom={() => searchCards(false)}
            hasReachedLimit={hasReachedLimit}
            footer={
              <AnimateHeight
                height={showExternalResults ? 'auto' : 0}
                onAnimationEnd={({ newHeight }) =>
                  newHeight !== 0 &&
                  externalResultsRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {renderExternalDocumentationResults()}
              </AnimateHeight>
            }
          />
          {!showExternalResults && renderFooter()}
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

  // Redux State
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  externalResults: PropTypes.arrayOf(
    PropTypes.shape({
      integration: PropTypes.shape({
        type: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      }),
      results: PropTypes.array
    })
  ).isRequired,
  isSearchingCards: PropTypes.bool,
  hasReachedLimit: PropTypes.bool.isRequired,

  // Redux Actions
  requestSearchCards: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestLogAudit: PropTypes.func.isRequired
};

SuggestionPanel.defaultProps = {
  isSearchingCards: false
};

export default SuggestionPanel;
