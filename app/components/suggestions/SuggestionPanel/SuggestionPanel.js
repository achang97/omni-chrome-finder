import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardArrowLeft } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';
import _ from 'lodash';

import SuggestionScrollContainer from '../SuggestionScrollContainer';
import { Loader, Button, Triangle, Timeago, Separator } from 'components/common';

import { colors } from 'styles/colors';
import { SEARCH, INTEGRATIONS, ANIMATE } from 'appConstants';

import style from './suggestion-panel.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const SuggestionPanel = ({
  query, cards, externalResults, isSearchingCards, hasReachedLimit,
  requestSearchCards, clearSearchCards
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showExternalResults, setShowExternalResults] = useState(false);
  const [showIntegration, setShowIntegration] = useState({});

  const externalResultsRef = useRef(null);

  useEffect(() => {
    if (query === '') {
      clearSearchCards(SEARCH.TYPE.POPOUT);
    } else {
      debouncedRequestSearch();
    }
  }, [query])

  const searchCards = (clearCards) => {
    requestSearchCards(SEARCH.TYPE.POPOUT, { q: query }, clearCards);
  }

  const debouncedRequestSearch = _.debounce(() => {
    searchCards(true);
  }, ANIMATE.DEBOUNCE.MS_300)

  const toggleIntegration = (integration) => {
    setShowIntegration({
      ...showIntegration,
      [integration]: !showIntegration[integration]
    })
  }

  const renderExternalSourceResults = ({ integration: { type, logo, title }, results }) => {
    let renderFn;
    switch (type) {
      case INTEGRATIONS.SLACK.type: {
        renderFn = ({ text, link, sender, channel }) => (
          <a target="_blank" href={link} key={link}>
            <div className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-sm')}>
                <div>
                  <div className={s('suggestion-panel-external-result-text font-semibold text-purple-reg mb-xs')}> {channel === 'Personal Message' ? 'Direct Message' : `#${channel}`} </div>
                  <div className={s('suggestion-panel-external-result-text suggestion-panel-external-result-sender')}> @{sender} </div>
                </div>
                <div className={s('suggestion-panel-external-result-icon ml-xs')}>
                  <img src={logo} />
                </div>
              </div>
              <div className={s('text-xs line-clamp-3')}> {text} </div>
            </div>
          </a>
        );
        break;
      }
      case INTEGRATIONS.GOOGLE.type: {
        renderFn = ({ name, id, webViewLink, iconLink }) => (
          <a target="_blank" href={webViewLink} key={id}>
            <div className={s('suggestion-panel-external-result items-center')}>
              <div className={s('suggestion-panel-external-result-text suggestion-panel-external-result-link')}> {name} </div>
              <div className={s('suggestion-panel-external-result-icon ml-xs')}>
                <img src={logo} />
              </div>
            </div>
          </a>
        );
        break;
      }
      case INTEGRATIONS.ZENDESK.type: {
        renderFn = ({ id, agentUrl, updated_at, type, raw_subject, description, priority, status }) => (
          <a target="_blank" href={agentUrl} key={id}>
            <div className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-sm')}>
                <div className={s('min-w-0')}>
                  <div className={s('suggestion-panel-external-result-text font-semibold text-purple-reg mb-xs')}> {raw_subject} </div>
                  <div className={s('text-xs text-gray-light')}>
                    <span> Priority: <span className={s('italic')}> {priority} </span> </span>
                    <span className={s('ml-sm')}> Status: <span className={s('italic')}> {status} </span> </span>
                  </div>
                </div>
                <div className={s('suggestion-panel-external-result-icon ml-xs')}>
                  <img src={logo} />
                </div>
              </div>
              <div className={s('text-xs line-clamp-3')}> {description} </div>
              <Timeago date={updated_at} className={s('suggestion-panel-external-result-date')} />
            </div>
          </a>
        );
        break;
      }
      case INTEGRATIONS.GMAIL.type: {
        renderFn = ({ id, webLink, deliveredTo, date, from, subject }) => (
          <a target="_blank" href={webLink} key={id}>
            <div className={s('suggestion-panel-external-result flex-col')}>
              <div className={s('flex justify-between mb-xs')}>
                <div className={s('suggestion-panel-external-result-text font-semibold text-purple-reg mb-xs')}> {subject} </div>
                <div className={s('suggestion-panel-external-result-icon ml-xs')}>
                  <img src={logo} />
                </div>
              </div>
              <div className={s('text-xs flex mb-xs')}>
                <div className={s('font-semibold w-4xl flex-shrink-0 text-xs')}> From: </div>
                <div className={s('suggestion-panel-external-result-text text-xs')}> {from} </div>
              </div>
              <div className={s('suggestion-panel-external-result-text flex')}>
                <div className={s('font-semibold w-4xl flex-shrink-0 text-xs')}> To: </div>
                <div className={s('suggestion-panel-external-result-text text-xs')}> {deliveredTo} </div>
              </div>
              <Timeago date={date} className={s('suggestion-panel-external-result-date')} />
            </div>
          </a>
        );
        break;
      }
    }

    const isOpen = showIntegration[type];
    return (
      <div key={type}>
        <div
          className={s('flex items-center justify-between px-lg py-sm mb-xs cursor-pointer rounded-b-lg')}
          onClick={() => toggleIntegration(type)}
        >
          <div className={s('flex items-center text-md text-gray-dark')}>
            <div className={s('suggestion-panel-external-result-icon mr-sm')}>
              <img src={logo} />
            </div>
            <span className={s('font-semibold mr-sm')}> {title} </span>
            <span> ({results.length}) </span>
          </div>
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
        <AnimateHeight height={isOpen ? 'auto' : 0}>
          <div className={s('px-lg')}>
            { results.map(result => renderFn(result)) }
          </div>
        </AnimateHeight>
      </div>
    );
  }

  const countExternalResults = () => {
    let numExternalResults = 0;
    externalResults.forEach(({ results }) => numExternalResults += results.length);
    return numExternalResults;
  }

  const renderExternalDocumentationResults = () => {
    const numExternalResults = countExternalResults();
    if (numExternalResults === 0) {
      // AnimateHeight expects children prop
      return <div />;
    }

    return (
      <div className={s('flex-col bg-purple-light justify-center items-center')} ref={externalResultsRef}>
        { cards.length !== 0 &&
          <Separator horizontal className={s('my-sm')} />
        }
        <div className={s('flex justify-between items-center p-lg')}>
          <div className={s('text-purple-reg font-semibold')}> Found in your documentation ({numExternalResults}) </div>
          <MdClose
            className={s('button-hover')}
            color={colors.purple['gray-50']}
            onClick={() => setShowExternalResults(false)}
          />
        </div>
        { externalResults.map(renderExternalSourceResults)}
      </div>
    );
  }

  const renderFooter = () => {
    const numExternalResults = countExternalResults();

    if (numExternalResults === 0) {
      return null;
    }

    return (
      <div className={s('suggestion-panel-footer flex-col bg-white justify-center items-center mt-sm')}>
        <Button
          text={`Show results from your current documentation ${numExternalResults !== 0 ? `(${numExternalResults})` : ''}`}
          underline
          onClick={() => setShowExternalResults(true)}
          color="transparent"
          className={s('self-stretch rounded-none shadow-none py-lg')}
        />
      </div>
    );
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const numExternalResults = countExternalResults();
  const showMainPanel = isVisible && query.length !== 0;
  return (
    <div className={s(`suggestion-panel ${!showMainPanel ? 'border-0' :''}`)}>
      <AnimateHeight height={showMainPanel ? 'auto' : 0}>
        <div className={s('pt-reg')}>
          <div className={s('flex justify-between mb-sm px-reg')}>
            <div className={s('text-purple-gray-50 text-sm')}>
              {cards.length} card{cards.length !== 1 && 's'}
            </div>
            <MdClose className={s('button-hover text-gray-light')} onClick={toggleVisibility} />
          </div>
          <SuggestionScrollContainer
            scrollContainerClassName={`suggestion-panel-card-container ${showExternalResults ? 'suggestion-panel-card-container-lg' : ''}`}
            cards={cards}
            isSearchingCards={isSearchingCards}
            showPlaceholder={!showExternalResults || numExternalResults === 0}
            triangleColor={colors.purple.light}
            onBottom={() => searchCards(false)}
            hasReachedLimit={hasReachedLimit}
            footer={
              <AnimateHeight
                height={showExternalResults ? 'auto' : 0}
                onAnimationEnd={({ newHeight }) => newHeight !== 0 && externalResultsRef.current.scrollIntoView({ behavior: 'smooth' })}
              >
                {renderExternalDocumentationResults() }
              </AnimateHeight>
            }
          />
          { !showExternalResults && renderFooter() }
        </div>
      </AnimateHeight>
      { showMainPanel &&
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
      }
      { !isVisible && query.length !== 0 &&
        <div
          className={s('suggestion-panel-arrow-container suggestion-panel-toggle')}
          onClick={toggleVisibility}
        >
          <MdKeyboardArrowLeft />
        </div>
      }
    </div>
  );
}

SuggestionPanel.propTypes = {
  query: PropTypes.string.isRequired,
};

export default SuggestionPanel;