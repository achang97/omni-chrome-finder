import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import {
  MdCheck,
  MdKeyboardArrowUp,
  MdPeople,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Loader, Separator } from 'components/common';
import { SuggestionPanel, SuggestionCard } from 'components/suggestions';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import { USER_BADGE } from 'appConstants/profile';

import robotGetStarted from 'assets/images/general/robotGetStarted.png';

import {
  GET_STARTED_PERFORMANCE_CUTOFF,
  PROGRESS_BAR_STYLES,
  BADGE_PROPS,
  ACCOMPLISHMENT_IMAGES
} from './PerformanceProps';
import style from './minimized-ask.css';

const s = getStyleApplicationFn(style);

const MinimizedAsk = ({
  badge,
  percentage,
  performance,
  remainingAccomplishments,
  isGettingOnboardingStats,
  dockVisible,
  dockExpanded,
  searchText,
  showPerformanceScore,
  recentCards,
  isGettingRecentCards,
  updateAskSearchText,
  togglePerformanceScore,
  toggleDockHeight,
  requestGetUserOnboardingStats,
  requestGetRecentCards
}) => {
  const isMounted = useRef(null);
  const inputRef = useRef(null);

  const [carouselIndex, setCarouselIndex] = useState(0);

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
    inputRef.current.focus();
  }, [dockExpanded, dockVisible]);

  const getPerformanceColors = (score) => {
    switch (true) {
      case score === 100:
        return { pathColor: colors.gold.reg, textColor: 'text-gold-reg' };
      case score < 100 && score >= 80:
        return { pathColor: colors.green.reg, textColor: 'text-green-reg' };
      case score < 80 && score >= 60:
        return { pathColor: colors.yellow.reg, textColor: 'text-yellow-500' };
      case score < 60:
        return { pathColor: colors.purple.reg, textColor: 'text-purple-reg' };
      default:
        return {};
    }
  };

  const showFullDock = () => {
    if (showPerformanceScore) {
      togglePerformanceScore();
    }

    updateAskSearchText('');

    if (!dockExpanded) {
      toggleDockHeight();
    }
  };

  const togglePerformance = () => {
    if (dockExpanded) {
      toggleDockHeight();
    }
    togglePerformanceScore();
  };

  const getPerformanceMessage = () => {
    const baseText = 'Perform these tasks to ';
    switch (badge) {
      case null:
        return `${baseText}learn how to use Omni and earn a badge!`;
      case USER_BADGE.BRONZE:
        return `${baseText}earn a silver badge:`;
      case USER_BADGE.SILVER:
        return `${baseText}earn a gold badge:`;
      case USER_BADGE.GOLD:
        return `${baseText}earn a platinum badge:`;
      case USER_BADGE.PLATINUM:
        return "Congrats! You've achieved the highest Omni badge.";
      default:
        return '';
    }
  };

  const updateCarouselIndex = (delta) => {
    const numRemainingAccomplishments = remainingAccomplishments.length;
    const newIndex =
      (carouselIndex + numRemainingAccomplishments + delta) % numRemainingAccomplishments;
    setCarouselIndex(newIndex);
  };

  const renderAccomplishmentCarousel = () => {
    const numRemainingAccomplishments = remainingAccomplishments.length;

    if (badge === USER_BADGE.PLATINUM || numRemainingAccomplishments === 0) {
      return null;
    }

    const carouselDisabled = numRemainingAccomplishments <= 1;
    const { label } = remainingAccomplishments[carouselIndex];
    const { imgSrc } = ACCOMPLISHMENT_IMAGES[label];

    return (
      <>
        <div className={s('flex items-center mt-reg')}>
          <button onClick={() => updateCarouselIndex(-1)} disabled={carouselDisabled} type="button">
            <MdKeyboardArrowLeft />
          </button>
          <div className={s('w-full rounded-lg minimized-search-accomplishment-img-container')}>
            <img src={imgSrc} className={s('h-full w-full object-cover rounded-lg')} alt={label} />
          </div>
          <button onClick={() => updateCarouselIndex(+1)} disabled={carouselDisabled} type="button">
            <MdKeyboardArrowRight />
          </button>
        </div>
        <div
          className={s(
            'text-xs mt-reg text-center shadow-md rounded-lg p-xs bg-white text-purple-reg'
          )}
        >
          <span className={s('font-semibold')}> {label} </span>
          <span>
            ({carouselIndex + 1}/{numRemainingAccomplishments})
          </span>
        </div>
      </>
    );
  };

  const getPerformanceScoreOrBadge = () => {
    if (!badge) {
      return (
        <>
          <CircularProgressbar
            className={s('w-3xl h-3xl')}
            value={percentage}
            styles={buildStyles({
              ...PROGRESS_BAR_STYLES,
              pathColor: getPerformanceColors(percentage).pathColor
            })}
          />
          <div
            className={s(
              `text-xs font-semibold ml-sm ${getPerformanceColors(percentage).textColor}`
            )}
          >
            My Performance: {percentage}%
          </div>
        </>
      );
    }
    const { imgSrc, textClassName } = BADGE_PROPS[badge];
    return (
      <>
        <img src={imgSrc} className={s('minimized-search-badge-container')} alt={badge} />
        <div className={s(`${textClassName} text-xs font-semibold ml-sm`)}> {badge} </div>
      </>
    );
  };

  const renderRecentCardsSection = () => {
    const showSection = (isGettingRecentCards || recentCards.length !== 0) && !showPerformanceScore;
    return (
      <AnimateHeight height={showSection ? 'auto' : 0}>
        <div className={s('px-lg py-reg')}>
          <div className={s('text-gray-reg text-xs mb-reg')}> Recently Viewed Cards </div>
          {recentCards.map(({ _id, question, finderNode, status }) => (
            <SuggestionCard
              className={s('recent-card')}
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

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight
        height={showPerformanceScore ? 'auto' : 0}
        animationStateClasses={{
          staticHeightAuto: s('performance-score-container')
        }}
      >
        <div className={s('minimized-ask-accomplishment-section-container p-lg')}>
          <div className={s('flex justify-between')}>
            <div className={s('text-xs font-semibold text-gray-reg flex-1')}>
              {getPerformanceMessage()}
            </div>
            <MdKeyboardArrowUp className={s('cursor-pointer')} onClick={togglePerformance} />
          </div>
          {renderAccomplishmentCarousel()}
        </div>
        {!dockExpanded ? (
          <div
            className={s('text-center my-reg text-xs underline text-purple-reg cursor-pointer')}
            onClick={toggleDockHeight}
          >
            Show All Tasks
          </div>
        ) : (
          <div className={s('overflow-auto px-lg pb-lg')}>
            {performance.map(({ badge: sectionTitle, accomplishments }) => (
              <div key={sectionTitle}>
                <div className={s('text-gray-light text-sm my-sm')}> {sectionTitle} </div>
                {accomplishments.map(({ label, isComplete }) => (
                  <div
                    key={label}
                    className={s(
                      `flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${
                        isComplete
                          ? 'gold-gradient italic opacity-50'
                          : 'border border-solid border-gray-light'
                      }`
                    )}
                  >
                    <div className={s('text-xs')}> {label} </div>
                    <div
                      className={s(
                        `p-xs rounded-lg font-semibold flex ${
                          isComplete
                            ? 'gold-gradient text-gold-reg'
                            : 'text-purple-light bg-purple-light border border-solid border-gray-xlight'
                        }`
                      )}
                    >
                      <MdCheck />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </AnimateHeight>
    );
  };

  const render = () => {
    const showRobot =
      !isGettingOnboardingStats &&
      performance.length !== 0 &&
      percentage < GET_STARTED_PERFORMANCE_CUTOFF;

    return (
      <div className={s('pt-lg flex flex-col min-h-0')}>
        <div className={s('px-lg')}>
          <input
            onChange={(e) => updateAskSearchText(e.target.value)}
            value={searchText}
            placeholder="Let's find what you're looking for"
            className={s('w-full minimized-search-input')}
            ref={inputRef}
            autoFocus
          />
          <div className={s('mt-lg flex flex-row justify-between items-center pb-lg')}>
            <div className={s('flex flex-col justify-center items-center relative')}>
              <div
                className={s('flex items-center cursor-pointer')}
                onClick={togglePerformanceScore}
              >
                {isGettingOnboardingStats ? <Loader size="sm" /> : getPerformanceScoreOrBadge()}
              </div>
              <div
                onClick={togglePerformance}
                className={s(`robot-img ${!showRobot ? 'pointer-events-none' : ''}`)}
              >
                <img
                  src={robotGetStarted}
                  style={{ opacity: showRobot ? 1 : 0 }}
                  alt="Omni Robot"
                  className={s('h-full')}
                />
              </div>
            </div>
            <div
              className={s(
                'text-purple-reg font-semibold cursor-pointer flex items-center ask-teammate-container'
              )}
              onClick={showFullDock}
            >
              <div>Ask a Teammate</div>
              <MdPeople className={s('text-md ml-sm')} />
            </div>
          </div>
          <Separator className={s('my-0')} horizontal />
        </div>
        <div className={s('min-h-0')}>
          {renderRecentCardsSection()}
          {renderPerformanceScoreSection()}
        </div>
        <SuggestionPanel query={searchText} shouldSearchNodes />
      </div>
    );
  };

  return render();
};

MinimizedAsk.propTypes = {
  badge: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  performance: PropTypes.arrayOf(
    PropTypes.shape({
      badge: PropTypes.string.isRequired,
      accomplishments: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          isComplete: PropTypes.bool.isRequired
        })
      )
    })
  ).isRequired,
  remainingAccomplishments: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired
    })
  ),
  isGettingOnboardingStats: PropTypes.bool,
  dockVisible: PropTypes.bool.isRequired,
  dockExpanded: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  recentCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGettingRecentCards: PropTypes.bool,
  showPerformanceScore: PropTypes.bool.isRequired,

  // Redux Actions
  updateAskSearchText: PropTypes.func.isRequired,
  togglePerformanceScore: PropTypes.func.isRequired,
  toggleDockHeight: PropTypes.func.isRequired,
  requestGetUserOnboardingStats: PropTypes.func.isRequired
};

export default MinimizedAsk;
