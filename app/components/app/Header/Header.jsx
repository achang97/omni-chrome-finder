import React from 'react';
import PropTypes from 'prop-types';
import { MdNotificationsActive, MdLightbulbOutline } from 'react-icons/md';

import { Tabs, Tab, Badge, PlaceholderImg } from 'components/common';
import { ROUTES } from 'appConstants';

import { segment } from 'utils';
import { UserPropTypes } from 'utils/propTypes';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import style from './header.css';

const s = getStyleApplicationFn(style);

const Header = ({ user, numAutofindCards, numTasks, history, location: { pathname } }) => {
  const handleTabClick = (activeLink) => {
    segment.track({ name: `Open ${activeLink[1].toUpperCase() + activeLink.substr(2)} Tab` });
    history.push(activeLink);
  };

  const showAutofind = numAutofindCards !== 0;
  return (
    <div className={s('bg-purple-xlight relative')}>
      <Tabs
        onTabClick={handleTabClick}
        activeValue={pathname}
        tabClassName={s('text-md py-xl px-0 font-semibold flex items-center')}
        tabContainerClassName={s('flex align-center')}
        color={colors.purple.reg}
        showRipple={false}
      >
        <Tab label="Search" key="ask" value={ROUTES.ASK} tabContainerClassName={s('mx-reg')} />
        <Tab
          label="Create"
          key="create"
          value={ROUTES.CREATE}
          tabContainerClassName={s('mx-reg')}
        />
        <Tab
          label="Cards"
          key="cards"
          value={ROUTES.NAVIGATE}
          tabContainerClassName={s('mx-reg')}
        />
        {showAutofind && (
          <Tab
            key="suggest"
            value={ROUTES.SUGGEST}
            tabContainerClassName={s('header-small-tab ml-auto')}
          >
            <div className={s('header-badge-container gold-gradient')}>
              <MdLightbulbOutline className={s('text-gold-reg')} />
              <Badge count={numAutofindCards} size="sm" className={s('bg-gold-reg')} />
            </div>
          </Tab>
        )}
        <Tab
          key="tasks"
          value={ROUTES.TASKS}
          tabContainerClassName={s(`header-small-tab ${!showAutofind ? 'ml-auto' : ''}`)}
        >
          <div className={s('header-badge-container bg-gray-xlight')}>
            <MdNotificationsActive />
            <Badge count={numTasks} size="sm" className={s('bg-red-500')} />
          </div>
        </Tab>
        <Tab key="profile" value={ROUTES.PROFILE} tabContainerClassName={s('mx-reg')}>
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
  user: UserPropTypes.isRequired,
  numAutofindCards: PropTypes.number.isRequired,
  numTasks: PropTypes.number.isRequired
};

export default Header;
