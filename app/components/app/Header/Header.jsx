import React from 'react';
import PropTypes from 'prop-types';
import { MdNotificationsActive, MdLightbulbOutline, MdAdd, MdHome } from 'react-icons/md';
import { IoIosFolder } from 'react-icons/io';

import { Tabs, Tab, Badge, PlaceholderImg } from 'components/common';
import { ROUTES } from 'appConstants';

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
  history,
  location: { pathname }
}) => {
  const handleTabClick = (activeLink) => {
    history.push(activeLink);
  };

  const showAutofind = numAutofindCards !== 0;
  return (
    <div className={s('relative')}>
      <Tabs
        onTabClick={handleTabClick}
        activeValue={pathname}
        tabClassName={s(
          'text-sm mt-xl mb-reg mx-0 bg-white shadow-md rounded-full font-semibold flex items-center p-0 border-0'
        )}
        tabContainerClassName={s('flex align-center border-0')}
        activeTabClassName={s('bg-purple-light border-0')}
        color={colors.purple.reg}
        showRipple={false}
      >
        <Tab
          key="ask"
          value={ROUTES.ASK}
          tabContainerClassName={s('ml-reg')}
          tabClassName={s('px-sm')}
        >
          <MdHome />
          <div className={s('text-xs ml-xs')}>Home</div>
        </Tab>
        <Tab
          key="create"
          value={ROUTES.CREATE}
          tabContainerClassName={s('mx-sm')}
          tabClassName={s('px-sm')}
        >
          <MdAdd />
          <div className={s('text-xs ml-xs')}>Create</div>
        </Tab>
        {showAutofind && (
          <Tab
            key="suggest"
            value={ROUTES.SUGGEST}
            tabContainerClassName={s('header-small-tab ml-auto')}
            tabClassName={s('header-badge-container gold-gradient')}
          >
            <MdLightbulbOutline className={s('text-gold-reg')} />
            <Badge count={numAutofindCards} size="sm" className={s('bg-gold-reg')} />
          </Tab>
        )}
        <Tab
          key="cards"
          onTabClick={openFinder}
          tabContainerClassName={s(`header-small-tab ${!showAutofind ? 'ml-auto' : ''}`)}
          tabClassName={s('opacity-100 primary-gradient text-white px-sm')}
        >
          <IoIosFolder className={s('flex-shrink-0')} />
          <div className={s('text-xs ml-xs')}>Cards</div>
        </Tab>
        <Tab
          key="tasks"
          value={ROUTES.TASKS}
          tabContainerClassName={s('header-small-tab')}
          tabClassName={s('header-badge-container bg-white shadow-md')}
        >
          <MdNotificationsActive />
          <Badge count={numTasks} size="sm" className={s('bg-red-500')} />
        </Tab>
        <Tab key="profile" value={ROUTES.PROFILE} tabContainerClassName={s('ml-xs mr-reg')}>
          <PlaceholderImg
            name={`${user.firstname} ${user.lastname}`}
            src={user.profilePicture}
            className={s('header-profile-picture')}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

Header.propTypes = {
  // Redux State
  user: UserPropTypes.isRequired,
  numAutofindCards: PropTypes.number.isRequired,
  numTasks: PropTypes.number.isRequired,

  // Redux Actions
  openFinder: PropTypes.func.isRequired
};

export default Header;
