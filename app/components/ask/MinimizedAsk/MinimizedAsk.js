import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import AnimateHeight from 'react-animate-height';
import { MdClose, MdChevronRight, MdCheck, MdKeyboardArrowUp, MdPeople, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Button, Message, Separator, Loader } from 'components/common';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import robotGetStarted from 'assets/images/general/robotGetStarted.png';

import bronzeImg from 'assets/images/badges/bronze.svg';
import silverImg from 'assets/images/badges/silver.svg';
import goldImg from 'assets/images/badges/gold.svg';
import platinumImg from 'assets/images/badges/platinum.svg';

import style from './minimized-ask.css';
const s = getStyleApplicationFn(style);

const GET_STARTED_PERFORMANCE_CUTOFF = 60;

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


const BADGE = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
}

const BADGE_PROPS = [
  { value: BADGE.BRONZE, imgSrc: bronzeImg, textClassName: 'badge-bronze' },
  { value: BADGE.SILVER, imgSrc: silverImg, textClassName: 'badge-silver' },
  { value: BADGE.GOLD, imgSrc: goldImg, textClassName: 'badge-gold' },
  { value: BADGE.PLATINUM, imgSrc: platinumImg, textClassName: 'badge-platinum' },
]

const MOCK_USER = {
    badge: 'silver', // or numeric percentage
      /*
      performance: [
          {
              badge: 'Bronze', 
              accomplishments: [
                  { label: '', isComplete: true / false }
              ]
          },
          {
              badge: 'Silver', 
              accomplishments: [
                  { label: '', isComplete: true / false }
                  { label: '', isComplete: true / false }
              ]
          },
          { // This is your current badge
              badge: 'Gold',
              ...
          }
      ],*/
  }

const MinimizedAsk = ({
  toggleDockHeight, isGettingOnboardingStats, onboardingStats, dockVisible, dockExpanded,
  searchText, updateAskSearchText, requestSearchCards,
  toggleAskFeedbackInput, showFeedback, feedback, updateAskFeedback,
  requestSubmitFeedback, isSubmittingFeedback, feedbackSuccess, feedbackError,
  togglePerformanceScore, showPerformanceScore,
  requestGetUserOnboardingStats,
}) => {
  const isMounted = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let refreshStats = showPerformanceScore;

    if (!isMounted.current) {
      isMounted.current = true;
      refreshStats = true;
    } 

    if (refreshStats) {
      requestGetUserOnboardingStats();
    }
  }, [showPerformanceScore]);

  useEffect(() => {
    inputRef.current.focus();
  }, [dockExpanded, dockVisible]);

  const getPerformanceColors = (score) => {
    switch (true) {
      case score === 100:
        return { pathColor: colors.gold.reg, textColor: 'text-gold-reg'};
      case score < 100 && score >= 80:
        return { pathColor: colors.green.reg, textColor: 'text-green-reg' };
      case score < 80 && score >= 60:
        return { pathColor: colors.yellow.reg, textColor: 'text-yellow-500' };
      case score < 60:
        return { pathColor: colors.purple.reg, textColor: 'text-purple-reg' };
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

    if (!dockExpanded) {
      toggleDockHeight();
    }
  }

  const togglePerformance = () => {
    //toggleDockHeight();
    togglePerformanceScore();
  }

  const getPerformanceMessage = () => {
    const baseText = "Perform these tasks to ";
    if (!MOCK_USER.badge) return baseText + "learn how to use Omni and earn a badge!";
    switch (MOCK_USER.badge) {
      case BADGE.BRONZE:
        return baseText + "earn a silver badge:";
      case BADGE.SILVER:
        return baseText + "earn a gold badge:";
      case BADGE.GOLD:
        return baseText + "earn a platinum badge:";
      case BADGE.PLATINUM:
        return "Congrats! You've achieved the highest Omni badge:";
      default:
        return {};
    }
  }
  const renderAccomplishmentCarousel = () => {
    return (
      <div>
        <div className={s('text-xs font-semibold text-gray-reg mb-xs')}>{getPerformanceMessage()}</div>
        <div className={s('flex items-center')}>
          <MdKeyboardArrowLeft className={s('cursor-pointer')} />
          <div className={s('w-full rounded-lg minimized-search-accomplishment-img-container')}></div>
          <MdKeyboardArrowRight className={s('cursor-pointer')} />
        </div>
        <div className={s('text-xs font-semibold mt-sm text-center')}>The name of this accomp</div>
      </div>
    )
  }

  const getPerformanceScoreOrBadge = () => {
    if(!MOCK_USER.badge) {
      return (
        <React.Fragment>
          <CircularProgressbar
            className={s('w-3xl h-3xl')}
            value={getPerformanceScore()}
            styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
          />
          <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>
        </React.Fragment>
      )
    } else {
      const { value, imgSrc, textClassName } = BADGE_PROPS.find(b => b.value === MOCK_USER.badge);
      return (
        <React.Fragment>
          <img src={imgSrc} className={s('minimized-search-badge-container')}/>
          <div className={s(`${textClassName} text-xs font-semibold ml-sm`)}> {value} </div>
        </React.Fragment>
      )
    }
  }

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight height={showPerformanceScore ? 'auto' : 0}>
        <div className={s('bg-purple-xlight p-lg')}>
        <div className={s(('flex justify-between mb-xs text-gray-dark items-center mb-reg cursor-pointer'))} onClick={togglePerformance}>
          <div className={s('flex items-center')}>
            {
              getPerformanceScoreOrBadge()
            }
          </div>
          <MdKeyboardArrowUp className={s('cursor-pointer')}/>
        </div>
        { renderAccomplishmentCarousel() }
        </div>
        <div className={s('text-center my-reg text-xs underline text-purple-reg cursor-pointer')}>Show All Tasks</div>
        {/*
        <div className={s('overflow-auto px-lg pb-lg')}>
        { PERFORMANCE_CRITERIA.map(({ weight, title, type }) => (
          <div className={s(`flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${onboardingStats[type] ? 'gold-gradient italic opacity-50' : 'border border-solid border-gray-light'}`)}>
            <div className={s('text-xs')}>{title}</div>
            <div className={s(`p-xs rounded-lg font-semibold flex ${onboardingStats[type] ? 'gold-gradient text-gold-reg' : 'text-purple-light bg-purple-light border border-solid border-gray-xlight'}`)}><MdCheck /></div>
          </div>
        ))}
        </div>*/}
      </AnimateHeight>
    )
  }

  const renderFeedbackSection = () => (
    <AnimateHeight height={showFeedback ? 'auto' : 0}>
      <div className={s('px-lg pt-lg')}>
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
      </div>
    </AnimateHeight>
  );

  const render = () => {
    const performanceScore = getPerformanceScore();
    const showRobot = !isGettingOnboardingStats && !_.isEmpty(onboardingStats) &&
      performanceScore < GET_STARTED_PERFORMANCE_CUTOFF;

    const showFooter = showFeedback || showPerformanceScore;

    return (
      <div className={s('pt-lg flex flex-col min-h-0')}>
        <div className={s('px-lg')}>
          <input
            onChange={e => updateAskSearchText(e.target.value)}
            value={searchText}
            placeholder="Let's find what you're looking for"
            className={s('w-full minimized-search-input')}
            ref={inputRef}
            autoFocus
          />
          <div className={s('mt-lg flex flex-row justify-end items-center pb-lg')}>
            <div 
              className={s('text-purple-reg font-semibold cursor-pointer flex items-center ask-teammate-container')}
              onClick={showFullDock}>
              <div>Ask a Teammate</div>
              <MdPeople className={s('text-md ml-sm')}/>
            </div>
          </div>
          <Separator horizontal className={s(showFooter ? 'mb-0' : '')} />
        </div>
        <AnimateHeight height={showFooter ? 0 : 'auto'}>
          <div className={s('flex justify-between items-center mt-reg px-lg pb-lg ')}>
            <div className={s('flex flex-col justify-center items-center relative')}>
              <div className={s('flex items-center cursor-pointer')} onClick={togglePerformance}>
                { isGettingOnboardingStats ?
                  <Loader size="sm" /> :
                  getPerformanceScoreOrBadge()
                  /*
                  <CircularProgressbar
                    className={s('w-3xl h-3xl')}
                    value={getPerformanceScore()}
                    styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(getPerformanceScore()).pathColor })}
                  />*/
                }
                {/*<div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(getPerformanceScore()).textColor}`)}>My Performance: {getPerformanceScore()}%</div>*/}
              </div>
              <img
                src={robotGetStarted}
                className={s('robot-img')} 
                onClick={togglePerformance}
                style={{ opacity: showRobot ? 1 : 0 }}
              />
            </div>
            <div className={s('flex justify-end text-gray-dark text-xs font-medium')}>
              <div className={s('cursor-pointer')} onClick={toggleAskFeedbackInput}>
                Have Feedback?
              </div>
            </div>
          </div>
        </AnimateHeight>
        <div className={s('min-h-0 overflow-auto')}>
          { renderPerformanceScoreSection() }
          { renderFeedbackSection() }        
        </div>
        <SuggestionPanel
          query={searchText}
        />
      </div>
    );    
  }

  return render();
}

export default MinimizedAsk;
