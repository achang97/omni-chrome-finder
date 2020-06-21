import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdNotificationsActive, MdLightbulbOutline, MdAdd, MdHome } from 'react-icons/md';
import { IoIosFolder } from 'react-icons/io';

import { Tabs, Tab, Badge, PlaceholderImg } from 'components/common';
import { ROUTES, SEGMENT } from 'appConstants';

import { UserPropTypes } from 'utils/propTypes';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import style from './header.css';

const s = getStyleApplicationFn(style);

const Header = ({
  user,
  numAutofindCards,
  numTasks,
  openFinder,
  trackEvent,
  history,
  location: { pathname }
}) => {
  const showAutofind = numAutofindCards !== 0;

  const TABS = [
    {
      key: 'ask',
      value: ROUTES.ASK,
      tabClassName: 'px-sm',
      tabContainerClassName: 'ml-reg',
      children: (
        <>
          <MdHome />
          <div className={s('header-tab-label')}>Home</div>
        </>
      )
    },
    {
      key: 'create',
      value: ROUTES.CREATE,
      tabContainerClassName: 'mx-sm',
      tabClassName: 'px-sm',
      children: (
        <>
          <MdAdd />
          <div className={s('header-tab-label')}>Create</div>
        </>
      )
    },
    {
      isVisible: showAutofind,
      key: 'suggest',
      value: ROUTES.SUGGEST,
      tabContainerClassName: 'header-small-tab ml-auto',
      tabClassName: 'header-badge-container gold-gradient',
      children: (
        <>
          <MdLightbulbOutline className={s('text-gold-reg')} />
          <Badge count={numAutofindCards} size="sm" className={s('bg-gold-reg')} />
        </>
      )
    },
    {
      key: 'cards',
      onTabClick: () => {
        openFinder();
        trackEvent(SEGMENT.EVENT.OPEN_FINDER, { Channel: SEGMENT.CHANNEL.EXTENSION });
      },
      tabContainerClassName: `header-small-tab ${!showAutofind ? 'ml-auto' : ''}`,
      tabClassName: 'opacity-100 primary-gradient text-white px-sm',
      children: (
        <>
          <IoIosFolder className={s('flex-shrink-0')} />
          <div className={s('header-tab-label')}>Cards</div>
        </>
      )
    },
    {
      key: 'tasks',
      value: ROUTES.TASKS,
      tabContainerClassName: 'header-small-tab',
      tabClassName: 'header-badge-container bg-white shadow-md',
      children: (
        <>
          <MdNotificationsActive />
          <Badge count={numTasks} size="sm" className={s('bg-red-500')} />
        </>
      )
    },
    {
      key: 'profile',
      value: ROUTES.PROFILE,
      tabContainerClassName: 'ml-xs mr-reg',
      children: (
        <PlaceholderImg
          name={`${user.firstname} ${user.lastname}`}
          src={user.profilePicture}
          className={s('header-profile-picture')}
        />
      )
    }
  ];

  const handleTabClick = (activeLink) => {
    history.push(activeLink);
    const pageName = _.capitalize(activeLink.substring(1));
    trackEvent(`${SEGMENT.EVENT.NAVIGATE} ${pageName}`);
  };

  return (
    <Tabs
      onTabClick={handleTabClick}
      activeValue={pathname}
      className={s('flex-shrink-0')}
      tabClassName={s(
        'text-sm mt-xl mb-reg mx-0 bg-white shadow-md rounded-full font-semibold flex items-center p-0 border-0'
      )}
      tabContainerClassName={s('flex align-center border-0')}
      activeTabClassName={s('bg-purple-light border-0')}
      color={colors.purple.reg}
      showRipple={false}
    >
      {TABS.filter(({ isVisible = true }) => isVisible).map(
        ({ key, tabClassName = '', tabContainerClassName = '', onTabClick, value, children }) => (
          <Tab
            key={key}
            value={value}
            tabClassName={s(tabClassName)}
            tabContainerClassName={s(tabContainerClassName)}
            onTabClick={onTabClick}
          >
            {children}
          </Tab>
        )
      )}
    </Tabs>
  );
};

Header.propTypes = {
  // Redux State
  user: UserPropTypes.isRequired,
  numAutofindCards: PropTypes.number.isRequired,
  numTasks: PropTypes.number.isRequired,

  // Redux Actions
  openFinder: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default Header;
