import React, { useEffect, useRef } from 'react';
import AnimateHeight from 'react-animate-height';
import { MdClose, MdChevronRight } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Button, Message, Separator, Loader } from 'components/common';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.gold.reg,
  pathColor: colors.purple.reg,

  textSize: '30px',
};

const USER_PERFORMANCE = {
  FIRST_CARD: 'createdCard',
  SEARCH_CARD: 'searchedAndViewed',
  MARK_HELPFUL: 'markedHelpful',
  CREATE_CARD: 'createdCardExtension',
  FLAG_OUTDATED: 'markedOutOfDate',
  ADD_TAG: 'addedTag',
  UP_TO_DATE: 'allUpToDate',
  NO_UNRESOLVED: 'noUnresolvedTasks',
  CREATE_CARD_RECENT: 'createdCardLastWeek',
  OWN_MULTIPLE: 'ownFourCards',
  ADD_SUBSCRIBER: 'addedSubscriber',
}

const PERFORMANCE_CRITERIA = [
  {
    type: USER_PERFORMANCE.FIRST_CARD,
    title: "Make your first card",
    weight: 20,
  },
  {
    type: USER_PERFORMANCE.SEARCH_CARD,
    title: "Search for a card and open it",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.MARK_HELPFUL,
    title: "Mark a card as helpful",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.CREATE_CARD,
    title: "Create a card in the extension",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.FLAG_OUTDATED,
    title: "Flag a card as out of date",
    weight: 5,
  },
  {
    type: USER_PERFORMANCE.ADD_TAG,
    title: "Add a tag to one of your cards",
    weight: 5,
  },
  {
    type: USER_PERFORMANCE.UP_TO_DATE,
    title: "Make sure all your cards are up to date",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.NO_UNRESOLVED,
    title: "Make sure all your tasks are resolved",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.CREATE_CARD_RECENT,
    title: "Created a card in the past week",
    weight: 5,
  },
  {
    type: USER_PERFORMANCE.OWN_MULTIPLE,
    title: "Own at least 4 cards",
    weight: 10,
  },
  {
    type: USER_PERFORMANCE.ADD_SUBSCRIBER,
    title: "Add a subscriber to your card",
    weight: 5,
  }
];

const MinimizedAsk = ({
  toggleDockHeight, onboardingStats,
  searchText, updateAskSearchText, requestSearchCards,
  toggleAskFeedbackInput, showFeedback, feedback, updateAskFeedback,
  requestSubmitFeedback, isSubmittingFeedback, feedbackSuccess, feedbackError,
  togglePerformanceScore, showPerformanceScore,
  requestGetUserOnboardingStats,
}) => {
  const isMounted = useRef(null);

  useEffect(() => {
    let refreshStats = showPerformanceScore;

    if (!isMounted.current) {
      isMounted.current = true;
      refreshStats = true;
    } 

    if (refreshStats) {
      requestGetUserOnboardingStats();
    }
  }, [showPerformanceScore])

  const getPerformanceColors = (score) => {
    switch (true) {
      case score === 100:
        return { pathColor: colors.gold.reg, textColor: 'text-gold-reg'};
      case score < 100 && score >= 80:
        return { pathColor: colors.green.reg, textColor: 'text-green-reg' };
      case score < 80 && score >= 60:
        return { pathColor: colors.yellow.reg, textColor: 'text-yellow-500' };
      case score < 60:
        return { pathColor: colors.red.reg, textColor: 'text-red-reg' };
      default:
        return {};
    }
  }

  const getPerformanceScore = () => {
    let score = 0;
    PERFORMANCE_CRITERIA.map(({ type, weight }) => {
      if (onboardingStats[type]) score += weight;
    })
    return score;
  }

  const showFullDock = () => {
    if (showFeedback) {
      toggleAskFeedbackInput();
      updateAskFeedback('');
    }

    if (showPerformanceScore) {
      togglePerformanceScore();
    }

    updateAskSearchText('');
    toggleDockHeight();
  }

  const togglePerformance = () => {
    toggleDockHeight();
    togglePerformanceScore();
  }

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight height={showPerformanceScore ? 'auto' : 0}>
        <Separator horizontal className={s('my-reg')} />
        <div className={s(('flex justify-between mb-xs text-gray-dark items-center mb-reg'))}>
          <div className={s('flex items-center')}>
            <CircularProgressbar
              className={s('w-3xl h-3xl')}
              value={getPerformanceScore()}
              styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
            />
            <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>
          </div>
          <MdClose className={s('cursor-pointer')} onClick={togglePerformance} />
        </div>
        <div className={s('overflow-auto')}>
        { PERFORMANCE_CRITERIA.map(({ weight, title, type }) => (
          <div className={s(`flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${onboardingStats[type] ? 'gold-gradient italic' : 'border border-solid border-gray-light'}`)}>
            <div className={s('text-xs')}>{title}</div>
            <div className={s(`p-xs rounded-lg font-semibold ${onboardingStats[type] ? 'gold-gradient text-gold-reg' : 'text-purple-reg'}`)}>{weight}%</div>
          </div>
        ))}
        </div>
      </AnimateHeight>
    )
  }

  const renderFeedbackSection = () => (
    <AnimateHeight height={showFeedback ? 'auto' : 0}>
      <Separator horizontal className={s('my-reg')} />
      { feedbackSuccess ? 
        <Message
          message={<span> 🎉 <span className={s('mx-sm')}> Thanks for your feedback! </span> 🎉 </span>}
          className={s('text-md text-center text-green-reg')}
          animate
          temporary
          show={feedbackSuccess}
          onHide={toggleAskFeedbackInput}
          type="success"
        /> :
        <div>
          <div className={s(('flex justify-between mb-xs text-gray-dark'))}>
            <div className={s('text-xs')}> Enter your feedback: </div>
            <MdClose className={s('cursor-pointer')} onClick={toggleAskFeedbackInput} />
          </div>
          <textarea
            className={s('w-full resize')}
            value={feedback}
            onChange={e => updateAskFeedback(e.target.value)}
          />
          <Message className={s('my-sm')} message={feedbackError} type="error" />
          <Button
            text="Submit Feedback"
            color="transparent"
            className={s('p-xs')}
            iconLeft={false}
            icon={isSubmittingFeedback ?
              <Loader size="xs" className={s('ml-sm')} color="white" /> :
              null
            }
            disabled={feedback.length === 0}
            onClick={requestSubmitFeedback}
          />
        </div>
      }
    </AnimateHeight>
  );

  return (
    <div className={s('pt-lg flex flex-col min-h-0')}>
      <div className={s('px-lg')}>
        <input
          onChange={e => updateAskSearchText(e.target.value)}
          value={searchText}
          placeholder="Let's find what you're looking for"
          className={s('w-full')}
          autoFocus
        />
        <div className={s('mt-lg flex flex-row justify-center items-center')}>
          <span className={s('flex-1 text-gray-dark ml-sm text-xs font-medium')}>
            Don't see your question?
          </span>
          <Button
            text="Ask Question"
            color="primary"
            className={s('justify-between')}
            iconLeft={false}
            icon={<MdChevronRight color="white" className={s('ml-sm')} />}
            onClick={showFullDock}
          />
        </div>        
      </div>
      <AnimateHeight height={(showFeedback || showPerformanceScore) ? 0 : 'auto'}>
        <div className={s('flex justify-between items-center mt-reg px-lg')}>
          <div className={s('flex items-center cursor-pointer')} onClick={togglePerformance}>
            <CircularProgressbar
              className={s('w-3xl h-3xl')}
              value={getPerformanceScore()}
              styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
            />
            <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>
          </div>
          <div className={s('flex justify-end text-gray-dark text-xs font-medium')}>
            <div className={s('cursor-pointer')} onClick={toggleAskFeedbackInput}>
              Have Feedback?
            </div>
          </div>
        </div>
      </AnimateHeight>
      <div className={s('px-lg pb-lg min-h-0 overflow-auto')}>
        { renderPerformanceScoreSection() }
        { renderFeedbackSection() }        
      </div>
      <SuggestionPanel
        query={searchText}
      />
    </div>
  );
}

export default MinimizedAsk;
