import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import AnimateHeight from 'react-animate-height';
import { MdClose, MdChevronRight, MdCheck, MdKeyboardArrowUp, MdPeople, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Button, Message, Separator, Loader } from 'components/common';
import SuggestionPanel from 'components/suggestions/SuggestionPanel';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import { USER_BADGE } from 'appConstants/profile';

import robotGetStarted from 'assets/images/general/robotGetStarted.png';

import bronzeImg from 'assets/images/badges/bronze.svg';
import silverImg from 'assets/images/badges/silver.svg';
import goldImg from 'assets/images/badges/gold.svg';
import platinumImg from 'assets/images/badges/platinum.svg';

import searchCardImg from 'assets/images/accomplishments/search-card.png';
import createCardImg from 'assets/images/accomplishments/create-card.png';
import flagOutdatedImg from 'assets/images/accomplishments/flag-outdated.png';
import markHelpfulImg from 'assets/images/accomplishments/mark-helpful.png';
import contextSearchImg from 'assets/images/accomplishments/context-search.png';

import profilePictureImg from 'assets/images/accomplishments/profile-picture.png';
import ownFourImg from 'assets/images/accomplishments/own-four.png';


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

const BADGE_PROPS = {
  [USER_BADGE.BRONZE]: {
    imgSrc: bronzeImg, textClassName: 'badge-bronze'
  },
  [USER_BADGE.SILVER]: {
    imgSrc: silverImg, textClassName: 'badge-silver'
  },
  [USER_BADGE.GOLD]: {
    imgSrc: goldImg, textClassName: 'badge-gold'
  },
  [USER_BADGE.PLATINUM]: {
    imgSrc: platinumImg, textClassName: 'badge-platinum'
  }
};

const ACCOMPLISHMENT_IMAGES = {
  ['Make your first card']: {
    imgSrc: searchCardImg
  },
  ['Search for a card and open it']: {
    imgSrc: searchCardImg
  },
  ['Create a card in the extension']: {
    imgSrc: createCardImg
  },
  ['Flag a card as out of date']: {
    imgSrc: flagOutdatedImg
  },
  ['Mark a card as helpful']: {
    imgSrc: markHelpfulImg
  },
  ['Highlight, right click, and search Omni']: {
    imgSrc: contextSearchImg
  },

  ['Add a profile picture']: {
    imgSrc: profilePictureImg
  },
  ['Own at least 4 cards']: {
    imgSrc: ownFourImg
  },
}

const MinimizedAsk = ({
  badge, percentage, performance, remainingAccomplishments, isGettingOnboardingStats,
  dockVisible, dockExpanded,
  searchText, updateAskSearchText,
  toggleAskFeedbackInput, showFeedback, feedback, updateAskFeedback,
  requestSubmitFeedback, isSubmittingFeedback, feedbackSuccess, feedbackError,
  togglePerformanceScore, showPerformanceScore,
  toggleDockHeight, requestGetUserOnboardingStats,
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
    if (dockExpanded) {
      toggleDockHeight();
    }
    togglePerformanceScore();
  }

  const getPerformanceMessage = () => {
    const baseText = "Perform these tasks to ";
    switch (badge) {
      case null:
        return baseText + "learn how to use Omni and earn a badge!";
      case USER_BADGE.BRONZE:
        return baseText + "earn a silver badge:";
      case USER_BADGE.SILVER:
        return baseText + "earn a gold badge:";
      case USER_BADGE.GOLD:
        return baseText + "earn a platinum badge:";
      case USER_BADGE.PLATINUM:
        return "Congrats! You've achieved the highest Omni badge:";
      default:
        return '';
    }
  }

  const updateCarouselIndex = (delta) => {
    const numRemainingAccomplishments = remainingAccomplishments.length;
    const newIndex = (carouselIndex + numRemainingAccomplishments + delta) % numRemainingAccomplishments;
    setCarouselIndex(newIndex);
  }

  const renderAccomplishmentCarousel = () => {
    if (remainingAccomplishments.length === 0) {
      return null;
    }

    const numRemainingAccomplishments = remainingAccomplishments.length;
    const carouselDisabled = numRemainingAccomplishments <= 1;
    const { label } = remainingAccomplishments[carouselIndex];
    const { imgSrc } = ACCOMPLISHMENT_IMAGES[label] || {};
    
    return (
      <div>
        <div className={s('text-xs font-semibold text-gray-reg')}>{getPerformanceMessage()}</div>
        { badge !== USER_BADGE.PLATINUM &&
          <>
            <div className={s('flex items-center mt-reg')}>
              <button onClick={() => updateCarouselIndex(-1)} disabled={carouselDisabled}>
                <MdKeyboardArrowLeft />
              </button>
              <div className={s('w-full rounded-lg minimized-search-accomplishment-img-container')}>
                { imgSrc &&
                  <img src={imgSrc} className={s('h-full w-full object-cover rounded-lg')}/>
                }
              </div>
              <button onClick={() => updateCarouselIndex(+1)} disabled={carouselDisabled}>
                <MdKeyboardArrowRight />
              </button>
            </div>
            <div className={s('text-xs mt-reg text-center shadow-md rounded-lg p-xs bg-white text-purple-reg')}>
              <span className={s('font-semibold')}> {label} </span>
              <span> ({carouselIndex + 1}/{numRemainingAccomplishments}) </span>
            </div>
          </>
        }
      </div>
    )
  }

  const getPerformanceScoreOrBadge = () => {
    if(!badge) {
      return (
        <React.Fragment>
          <CircularProgressbar
            className={s('w-3xl h-3xl')}
            value={percentage}
            styles={buildStyles({...PROGRESS_BAR_STYLES, pathColor: getPerformanceColors(percentage).pathColor })}
          />
          <div className={s(`text-xs font-semibold ml-sm ${getPerformanceColors(percentage).textColor}`)}>My Performance: {percentage}%</div>
        </React.Fragment>
      )
    } else {
      const { imgSrc, textClassName } = BADGE_PROPS[badge];
      return (
        <React.Fragment>
          <img src={imgSrc} className={s('minimized-search-badge-container')} />
          <div className={s(`${textClassName} text-xs font-semibold ml-sm`)}> {badge} </div>
        </React.Fragment>
      )
    }
  }

  const renderPerformanceScoreSection = () => {
    return (
      <AnimateHeight
        height={showPerformanceScore ? 'auto' : 0}
        animationStateClasses={{
          staticHeightAuto: s('performance-score-container')
        }}
      >
        <div className={s('bg-purple-xlight p-lg')}>
          <div className={s(('flex justify-between mb-xs text-gray-dark items-center mb-reg cursor-pointer'))} onClick={togglePerformance}>
            <div className={s('flex items-center')}>
              { getPerformanceScoreOrBadge() }
            </div>
            <MdKeyboardArrowUp className={s('cursor-pointer')}/>
          </div>
          { renderAccomplishmentCarousel() }
        </div>
        { !dockExpanded ?
          <div
            className={s('text-center my-reg text-xs underline text-purple-reg cursor-pointer')}
            onClick={toggleDockHeight}
          >
            Show All Tasks
          </div> :
          <div className={s('overflow-auto px-lg pb-lg')}>
            { performance.map(({ badge: sectionTitle, accomplishments }) => (
              <div>
                <div className={s('text-gray-light text-sm my-sm')}> {sectionTitle} </div>
                { accomplishments.map(({ label, isComplete }) => (
                  <div
                    className={s(`flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${isComplete ?
                      'gold-gradient italic opacity-50' :
                      'border border-solid border-gray-light'}`
                    )}
                  >
                    <div className={s('text-xs')}> {label} </div>
                    <div
                      className={s(`p-xs rounded-lg font-semibold flex ${isComplete ?
                        'gold-gradient text-gold-reg' :
                        'text-purple-light bg-purple-light border border-solid border-gray-xlight'}`
                      )}
                    >
                      <MdCheck />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        }
      </AnimateHeight>
    )
  }

  const renderFeedbackSection = () => (
    <AnimateHeight height={showFeedback ? 'auto' : 0}>
      <div className={s('p-lg')}>
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
    const showRobot = !isGettingOnboardingStats && performance.length !== 0 &&
      percentage < GET_STARTED_PERFORMANCE_CUTOFF;
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
              <div className={s('flex items-center cursor-pointer')} onClick={togglePerformanceScore}>
                { isGettingOnboardingStats ?
                  <Loader size="sm" /> :
                  getPerformanceScoreOrBadge()
                }
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
        <div className={s('min-h-0')}>
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
