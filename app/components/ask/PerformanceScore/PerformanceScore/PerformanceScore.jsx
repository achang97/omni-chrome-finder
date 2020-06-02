import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MdCheck,
  MdKeyboardArrowUp,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';

import { USER_BADGE } from 'appConstants/profile';
import { getStyleApplicationFn } from 'utils/style';

import style from './performance-score.css';

import { ACCOMPLISHMENTS } from '../PerformanceProps';

const s = getStyleApplicationFn(style);

const PerformanceScore = ({
  badge,
  performance,
  remainingAccomplishments,
  togglePerformanceScore
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

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
    const { type } = remainingAccomplishments[carouselIndex];
    const { imgSrc, label } = ACCOMPLISHMENTS[type];

    return (
      <>
        <div className={s('flex items-center mt-reg')}>
          <button onClick={() => updateCarouselIndex(-1)} disabled={carouselDisabled} type="button">
            <MdKeyboardArrowLeft />
          </button>
          <div className={s('w-full rounded-lg performance-carousel-img-container')}>
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

  const render = () => {
    return (
      <>
        <div className={s('performance-score-section-container p-lg')}>
          <div className={s('flex justify-between')}>
            <div className={s('text-xs font-semibold text-gray-reg flex-1')}>
              {getPerformanceMessage()}
            </div>
            <MdKeyboardArrowUp className={s('cursor-pointer')} onClick={togglePerformanceScore} />
          </div>
          {renderAccomplishmentCarousel()}
        </div>
        <div className={s('overflow-auto px-lg pb-lg')}>
          {performance.map(({ badge: sectionTitle, accomplishments }) => (
            <div key={sectionTitle}>
              <div className={s('text-gray-light text-sm my-sm')}> {sectionTitle} </div>
              {accomplishments.map(({ type, isComplete }) => (
                <div
                  key={type}
                  className={s(
                    `flex justify-between mb-sm text-sm rounded-lg p-sm items-center ${
                      isComplete
                        ? 'gold-gradient italic opacity-50'
                        : 'border border-solid border-gray-light'
                    }`
                  )}
                >
                  <div className={s('text-xs')}> {ACCOMPLISHMENTS[type].label} </div>
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
      </>
    );
  };

  return render();
};

PerformanceScore.propTypes = {
  // Redux State
  badge: PropTypes.string,
  performance: PropTypes.arrayOf(
    PropTypes.shape({
      badge: PropTypes.string.isRequired,
      accomplishments: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          isComplete: PropTypes.bool.isRequired
        })
      )
    })
  ).isRequired,
  remainingAccomplishments: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      isComplete: PropTypes.bool.isRequired
    })
  ).isRequired,

  // Redux Actions
  togglePerformanceScore: PropTypes.func.isRequired
};

export default PerformanceScore;
