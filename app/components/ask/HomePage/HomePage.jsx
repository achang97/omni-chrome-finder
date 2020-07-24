import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MdPeople } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import { Separator } from 'components/common';
import { SuggestionPanel } from 'components/suggestions';
import { SEGMENT } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

import style from './home-page.css';

import ActivityLog from '../ActivityLog';
import PerformanceScore from '../PerformanceScore/PerformanceScore';
import PerformanceBadge from '../PerformanceScore/PerformanceBadge';

const s = getStyleApplicationFn(style);

const HomePage = ({
  dockVisible,
  searchText,
  showPerformanceScore,
  showAskTeammate,
  updateAskSearchText,
  toggleAskTeammate,
  requestGetUserOnboardingStats,
  trackEvent
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
  }, [showPerformanceScore, requestGetUserOnboardingStats]);

  useEffect(() => {
    if (!showAskTeammate) {
      inputRef.current.focus();
    }
  }, [showAskTeammate, dockVisible]);

  const renderAnimatedSection = (section, isSectionShown) => {
    return (
      <AnimateHeight
        height={isSectionShown ? 'auto' : 0}
        animationStateClasses={{
          staticHeightAuto: s('animated-section-container')
        }}
      >
        {section}
      </AnimateHeight>
    );
  };

  const openAskTeammateView = () => {
    toggleAskTeammate();
    trackEvent(SEGMENT.EVENT.CLICK_ASK_TEAMMATE);
  };

  const render = () => {
    return (
      <div className={s('pt-lg flex-1 flex flex-col min-h-0')}>
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
              onClick={openAskTeammateView}
            >
              <div>Ask a Teammate</div>
              <MdPeople className={s('text-md ml-sm')} />
            </div>
          </div>
          <Separator className={s('my-0')} horizontal />
        </div>
        <div className={s('min-h-0 flex-1 flex flex-col')}>
          {renderAnimatedSection(<ActivityLog />, !showPerformanceScore)}
          {renderAnimatedSection(<PerformanceScore />, showPerformanceScore)}
        </div>
        <SuggestionPanel query={searchText} />
      </div>
    );
  };

  return render();
};

HomePage.propTypes = {
  dockVisible: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  showPerformanceScore: PropTypes.bool.isRequired,
  showAskTeammate: PropTypes.bool.isRequired,

  // Redux Actions
  updateAskSearchText: PropTypes.func.isRequired,
  toggleAskTeammate: PropTypes.func.isRequired,
  requestGetUserOnboardingStats: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default HomePage;
