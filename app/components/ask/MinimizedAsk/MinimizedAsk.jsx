import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import {
  MdClose,
  MdCheck,
  MdKeyboardArrowUp,
  MdPeople,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Button, Message, Separator, Loader } from 'components/common';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';

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
  updateAskSearchText,
  toggleAskFeedbackInput,
  showFeedback,
  feedback,
  updateAskFeedback,
  requestSubmitFeedback,
  isSubmittingFeedback,
  feedbackSuccess,
  feedbackError,
  togglePerformanceScore,
  showPerformanceScore,
  toggleDockHeight,
  requestGetUserOnboardingStats
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

    if (refreshStats) {
      requestGetUserOnboardingStats();
    }
  }, [showPerformanceScore, requestGetUserOnboardingStats]);

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
    if (showFeedback) {
      toggleAskFeedbackInput();
      updateAskFeedback('');
    }

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

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight
        height={showPerformanceScore ? 'auto' : 0}
        animationStateClasses={{
          staticHeightAuto: s('performance-score-container')
        }}
      >
        <div className={s('minimized-ask-accomplishment-section-container p-lg')}>
          <div
            className={s(
              'flex justify-between mb-xs text-gray-dark items-center mb-reg cursor-pointer'
            )}
            onClick={togglePerformance}
          >
            <div className={s('flex items-center')}>{getPerformanceScoreOrBadge()}</div>
            <MdKeyboardArrowUp className={s('cursor-pointer')} />
          </div>
          <div className={s('text-xs font-semibold text-gray-reg')}>{getPerformanceMessage()}</div>
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

  const renderFeedbackSection = () => (
    <AnimateHeight height={showFeedback ? 'auto' : 0}>
      <div className={s('p-lg')}>
        {feedbackSuccess ? (
          <Message
            message={
              <span>
                <span role="img" aria-label="Party">
                  🎉
                </span>
                <span className={s('mx-sm')}> Thanks for your feedback! </span>
                <span role="img" aria-label="Party">
                  🎉
                </span>
              </span>
            }
            className={s('text-md text-center text-green-reg')}
            animate
            temporary
            show={feedbackSuccess}
            onHide={toggleAskFeedbackInput}
            type="success"
          />
        ) : (
          <div>
            <div className={s('flex justify-between mb-xs text-gray-dark')}>
              <div className={s('text-xs')}> Enter your feedback: </div>
              <MdClose className={s('cursor-pointer')} onClick={toggleAskFeedbackInput} />
            </div>
            <textarea
              className={s('w-full resize')}
              value={feedback}
              onChange={(e) => updateAskFeedback(e.target.value)}
            />
            <Message className={s('my-sm')} message={feedbackError} type="error" />
            <Button
              text="Submit Feedback"
              color="transparent"
              className={s('p-xs')}
              iconLeft={false}
              icon={
                isSubmittingFeedback ? (
                  <Loader size="xs" className={s('ml-sm')} color="white" />
                ) : null
              }
              disabled={feedback.length === 0}
              onClick={requestSubmitFeedback}
            />
          </div>
        )}
      </div>
    </AnimateHeight>
  );

  const render = () => {
    const showRobot =
      !isGettingOnboardingStats &&
      performance.length !== 0 &&
      percentage < GET_STARTED_PERFORMANCE_CUTOFF;
    const showFooter = showFeedback || showPerformanceScore;

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
          <div className={s('mt-lg flex flex-row justify-end items-center pb-lg')}>
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
          <Separator horizontal className={s(showFooter ? 'mb-0' : '')} />
        </div>
        <AnimateHeight height={showFooter ? 0 : 'auto'}>
          <div className={s('flex justify-between items-center mt-reg px-lg pb-lg ')}>
            <div className={s('flex flex-col justify-center items-center relative')}>
              <div
                className={s('flex items-center cursor-pointer')}
                onClick={togglePerformanceScore}
              >
                {isGettingOnboardingStats ? <Loader size="sm" /> : getPerformanceScoreOrBadge()}
              </div>
              <div onClick={togglePerformance} className={s('robot-img')}>
                <img
                  src={robotGetStarted}
                  style={{ opacity: showRobot ? 1 : 0 }}
                  alt="Omni Robot"
                  className={s('h-full')}
                />
              </div>
            </div>
            <div className={s('flex justify-end text-gray-dark text-xs font-medium')}>
              <div className={s('cursor-pointer')} onClick={toggleAskFeedbackInput}>
                Have Feedback?
              </div>
            </div>
          </div>
        </AnimateHeight>
        <div className={s('min-h-0')}>
          {renderPerformanceScoreSection()}
          {renderFeedbackSection()}
        </div>
        <SuggestionPanel query={searchText} />
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
  showFeedback: PropTypes.bool.isRequired,
  feedback: PropTypes.string.isRequired,
  isSubmittingFeedback: PropTypes.bool,
  feedbackSuccess: PropTypes.bool,
  feedbackError: PropTypes.string,
  showPerformanceScore: PropTypes.bool.isRequired,

  // Redux Actions
  updateAskSearchText: PropTypes.func.isRequired,
  toggleAskFeedbackInput: PropTypes.func.isRequired,
  updateAskFeedback: PropTypes.func.isRequired,
  requestSubmitFeedback: PropTypes.func.isRequired,
  togglePerformanceScore: PropTypes.func.isRequired,
  toggleDockHeight: PropTypes.func.isRequired,
  requestGetUserOnboardingStats: PropTypes.func.isRequired
};

export default MinimizedAsk;
