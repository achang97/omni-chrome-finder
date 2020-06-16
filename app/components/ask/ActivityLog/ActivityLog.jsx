import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiClock } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa';

import { Loader, Tabs, Tab, Timeago } from 'components/common';
import { CardUser } from 'components/cards';
import { SuggestionCard } from 'components/suggestions';
import { AUDIT } from 'appConstants/profile';

import { isSlackCard } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';
import { UserPropTypes } from 'utils/propTypes';
import { usePrevious } from 'utils/react';

const s = getStyleApplicationFn();

const ActivityLog = ({
  isGettingRecentCards,
  recentCards,
  activityIndex,
  showPerformanceScore,
  activityLog,
  isGettingActivityLog,
  dockVisible,
  ownUserId,
  requestGetRecentCards,
  requestGetActivityLog,
  updateActivityIndex
}) => {
  const renderPlaceholder = (placeholder) => {
    return <div className={s('text-sm text-gray-light mt-reg')}>{placeholder}</div>;
  };

  const renderCard = (card) => {
    const { _id, question, status, externalLinkAnswer, finderNode } = card;
    return (
      <SuggestionCard
        className={s('text-sm p-reg rounded-lg')}
        key={_id}
        id={_id}
        maxQuestionLines={1}
        question={question}
        createdFromSlack={isSlackCard(card)}
        externalLinkAnswer={externalLinkAnswer}
        showAnswer={false}
        status={status}
        finderNode={finderNode}
      />
    );
  };

  const renderRecentCardsSection = (placeholder, isLoading) => {
    return (
      <>
        {recentCards.map((card) => (
          <div key={card._id} className={s('my-sm')}>
            {renderCard(card)}
          </div>
        ))}
        {recentCards.length === 0 && !isLoading && renderPlaceholder(placeholder)}
      </>
    );
  };

  const getActionName = (type) => {
    switch (type) {
      case AUDIT.TYPE.VIEW_CARD: {
        return 'viewed';
      }
      case AUDIT.TYPE.CREATE_CARD: {
        return 'created';
      }
      case AUDIT.TYPE.UPDATE_CARD: {
        return 'updated';
      }
      default: {
        return '';
      }
    }
  };

  const renderActivityLogSection = (placeholder, isLoading) => {
    return (
      <>
        {activityLog.map(({ _id, card, user, type, createdAt }) => (
          <div key={_id} className={s('mt-xs mb-reg')}>
            <div className={s('flex items-center justify-between mb-xs text-2xs')}>
              <div className={s('flex items-center')}>
                <CardUser
                  name={`${user.firstname} ${user.lastname}`}
                  img={user.profilePicture}
                  showName={false}
                  size={20}
                />
                <span className={s('text-gray-dark ml-sm')}>
                  {user._id === ownUserId ? 'You' : user.firstname} {getActionName(type)}
                </span>
              </div>
              <Timeago live={false} date={createdAt} className={s('text-2xs text-gray-reg')} />
            </div>
            {renderCard(card)}
          </div>
        ))}
        {activityLog.length === 0 && !isLoading && renderPlaceholder(placeholder)}
      </>
    );
  };

  const TABS = [
    {
      Icon: FaListUl,
      label: 'Activity',
      renderFn: renderActivityLogSection,
      placeholder:
        "Here, you'll see your team's activity and cards that have been recently created, edited, or viewed.",
      getDataFn: requestGetActivityLog,
      isLoading: isGettingActivityLog
    },
    {
      Icon: FiClock,
      label: 'Recent',
      renderFn: renderRecentCardsSection,
      placeholder: "Here, you'll see cards that you've recently created, edited, or viewed.",
      getDataFn: requestGetRecentCards,
      isLoading: isGettingRecentCards
    }
  ];

  const prevActivityIndex = usePrevious(activityIndex);
  const prevDockVisible = usePrevious(dockVisible);

  useEffect(() => {
    const isMounting = prevActivityIndex === undefined && prevDockVisible === undefined;
    const hasPropsChanged =
      (prevDockVisible === false && dockVisible) ||
      (prevActivityIndex !== undefined && prevActivityIndex !== activityIndex);

    const shouldReload = !showPerformanceScore && (isMounting || hasPropsChanged);

    // TODO: Since we add reload behavior when the extension is opened, this fires twice
    // for app.addomni.com/extension. To hopefully avoid 2 requests, we check the isLoading flag,
    // which is not super reliable but works as a temp fix.
    if (shouldReload && !TABS[activityIndex].isLoading) {
      TABS[activityIndex].getDataFn();
    }
  }, [TABS, activityIndex, prevActivityIndex, showPerformanceScore, prevDockVisible, dockVisible]);

  const render = () => {
    return (
      <>
        <Tabs
          onTabClick={updateActivityIndex}
          activeValue={activityIndex}
          className={s('flex-shrink-0')}
          allTabsContainerClassName={s('px-lg')}
          tabContainerClassName={s('text-purple-reg mx-xs pt-reg pb-sm')}
          tabClassName={s(
            'text-xs px-reg py-sm font-semibold flex items-center rounded-full shadow-md'
          )}
          activeTabClassName={s('bg-purple-light')}
          showRipple={false}
        >
          {TABS.map(({ Icon, label }, i) => (
            <Tab key={label} value={i}>
              <Icon />
              <span className={s('ml-xs')}>{label}</span>
            </Tab>
          ))}
        </Tabs>
        {TABS.map(({ label, renderFn, isLoading, placeholder }, i) => (
          <React.Fragment key={label}>
            {i === activityIndex ? (
              <div className={s('px-lg overflow-auto flex-1')}>
                {renderFn(placeholder, isLoading)}
                {isLoading && <Loader size="sm" className={s('my-sm')} />}
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </>
    );
  };

  return render();
};

ActivityLog.propTypes = {
  // Redux State
  isGettingRecentCards: PropTypes.bool,
  recentCards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired,
      finderNode: PropTypes.object
    })
  ).isRequired,
  showPerformanceScore: PropTypes.bool.isRequired,
  activityIndex: PropTypes.number.isRequired,
  activityLog: PropTypes.arrayOf(
    PropTypes.shape({
      user: UserPropTypes.isRequired,
      createdAt: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      card: PropTypes.object
    })
  ).isRequired,
  isGettingActivityLog: PropTypes.bool,
  dockVisible: PropTypes.bool.isRequired,
  ownUserId: PropTypes.string.isRequired,

  // Redux Actions
  requestGetRecentCards: PropTypes.func.isRequired,
  requestGetActivityLog: PropTypes.func.isRequired,
  updateActivityIndex: PropTypes.func.isRequired
};

export default ActivityLog;
