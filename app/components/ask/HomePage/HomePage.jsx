import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdPeople } from 'react-icons/md';

import { Loader, Separator } from 'components/common';
import { SuggestionPanel, SuggestionCard } from 'components/suggestions';

import { getStyleApplicationFn } from 'utils/style';

import style from './home-page.css';

import PerformanceScore from '../PerformanceScore/PerformanceScore';
import PerformanceBadge from '../PerformanceScore/PerformanceBadge';

const s = getStyleApplicationFn(style);

const HomePage = ({
  dockVisible,
  searchText,
  showPerformanceScore,
  showAskTeammate,
  recentCards,
  isGettingRecentCards,
  updateAskSearchText,
  toggleAskTeammate,
  requestGetUserOnboardingStats,
  requestGetRecentCards
}) => {
  const isMounted = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let refreshStats = showPerformanceScore;

    if (!isMounted.current) {
      isMounted.current = true;
      refreshStats = true;
    }

    if (!showPerformanceScore) {
      requestGetRecentCards();
    }

    if (refreshStats) {
      requestGetUserOnboardingStats();
    }
  }, [showPerformanceScore, requestGetUserOnboardingStats, requestGetRecentCards]);

  useEffect(() => {
    if (!showAskTeammate) {
      inputRef.current.focus();
    }
  }, [showAskTeammate, dockVisible]);

  const renderRecentCardsSection = () => {
    const showSection = (isGettingRecentCards || recentCards.length !== 0) && !showPerformanceScore;
    return (
      <AnimateHeight height={showSection ? 'auto' : 0}>
        <div className={s('px-lg py-reg')}>
          <div className={s('text-gray-reg text-xs mb-reg')}> Recent</div>
          {recentCards.map(({ _id, question, status, finderNode }) => (
            <SuggestionCard
              className={s('text-sm p-reg my-sm rounded-lg')}
              key={_id}
              id={_id}
              question={question}
              status={status}
              finderNode={finderNode}
            />
          ))}
          {isGettingRecentCards && <Loader size="sm" />}
        </div>
      </AnimateHeight>
    );
  };

  const render = () => {
    return (
      <div className={s('pt-lg flex flex-col min-h-0')}>
        <div className={s('px-lg')}>
          <input
            onChange={(e) => updateAskSearchText(e.target.value)}
            value={searchText}
            placeholder="Let's find what you're looking for"
            className={s('w-full search-input')}
            ref={inputRef}
            autoFocus
          />
          <div className={s('mt-xl flex flex-row justify-between items-center pb-lg')}>
            <PerformanceBadge />
            <div
              className={s(
                'text-purple-reg font-semibold cursor-pointer flex items-center ask-teammate-container'
              )}
              onClick={toggleAskTeammate}
            >
              <div>Ask a Teammate</div>
              <MdPeople className={s('text-md ml-sm')} />
            </div>
          </div>
          <Separator className={s('my-0')} horizontal />
        </div>
        <div className={s('min-h-0')}>
          {renderRecentCardsSection()}
          <PerformanceScore />
        </div>
        <SuggestionPanel query={searchText} shouldSearchNodes />
      </div>
    );
  };

  return render();
};

HomePage.propTypes = {
  dockVisible: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  recentCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGettingRecentCards: PropTypes.bool,
  showPerformanceScore: PropTypes.bool.isRequired,
  showAskTeammate: PropTypes.bool.isRequired,

  // Redux Actions
  updateAskSearchText: PropTypes.func.isRequired,
  togglePerformanceScore: PropTypes.func.isRequired,
  toggleAskTeammate: PropTypes.func.isRequired,
  requestGetUserOnboardingStats: PropTypes.func.isRequired
};

export default HomePage;
