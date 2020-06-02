import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Loader } from 'components/common';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import style from './performance-badge.css';

import { PROGRESS_BAR_STYLES, BADGE_PROPS } from '../PerformanceProps';

const s = getStyleApplicationFn(style);

const PerformanceBadge = ({
  badge,
  percentage,
  isGettingOnboardingStats,
  togglePerformanceScore
}) => {
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
        <img src={imgSrc} className={s('search-badge-container')} alt={badge} />
        <div className={s(`${textClassName} text-xs font-semibold ml-sm`)}> {badge} </div>
      </>
    );
  };

  const render = () => {
    return (
      <div className={s('flex flex-col justify-center items-center relative')}>
        <div className={s('flex items-center cursor-pointer')} onClick={togglePerformanceScore}>
          {isGettingOnboardingStats ? <Loader size="sm" /> : getPerformanceScoreOrBadge()}
        </div>
      </div>
    );
  };

  return render();
};

PerformanceBadge.propTypes = {
  // Redux Actions
  badge: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  isGettingOnboardingStats: PropTypes.bool,

  // Redux Actions
  togglePerformanceScore: PropTypes.func.isRequired
};

export default PerformanceBadge;
