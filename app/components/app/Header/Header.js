import React from 'react';
import { MdNotificationsActive, MdLightbulbOutline, MdClose } from 'react-icons/md';

import { Tabs, Tab, Badge, PlaceholderImg } from 'components/common';
import ToggleTab from '../ToggleTab';
import { ROUTES } from 'appConstants';

import { segment } from 'utils';

import { colors } from 'styles/colors';
import style from './header.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const Header = ({
  user, numAISuggestCards, numTasks,
  minimizeDock,
  history, location: { pathname }
}) => {
  const handleTabClick = (activeLink) => {
    segment.track({name: `Open ${activeLink[1].toUpperCase() + activeLink.substr(2)} Tab`})
    history.push(activeLink);
  }

  const showAISuggest = numAISuggestCards !== 0;
  return (
    <div className={s('bg-purple-xlight relative')}>
      <div className={s('header-minimize-container')}>
        <button
          className={s('bg-white shadow-md rounded-full w-reg h-reg flex items-center justify-center')}
          onClick={minimizeDock}
        >
          <MdClose className={s('text-purple-reg text-xs')}/>
        </button>        
      </div>
      <Tabs
        onTabClick={handleTabClick}
        activeValue={pathname}
        tabClassName={s('text-md pt-0 pb-xl px-0 font-semibold flex items-center')}
        tabContainerClassName={s('flex align-center')}
        color={colors.purple.reg}
        showRipple={false}
      >
        <Tab label="Ask" key="ask" value={ROUTES.ASK} tabContainerClassName={s("mx-reg")} />
        <Tab label="Create" key="create" value={ROUTES.CREATE} tabContainerClassName={s("mx-reg")} />
        <Tab label="Cards" key="cards" value={ROUTES.NAVIGATE} tabContainerClassName={s("mx-reg")} />
        { showAISuggest &&
          <Tab key="suggest" value={ROUTES.SUGGEST} tabContainerClassName={s('header-small-tab ml-auto')}>
            <div className={s("header-badge-container gold-gradient")}>
              <MdLightbulbOutline className={s("text-gold-reg")} />
              <Badge count={numAISuggestCards} size="sm" className={s("bg-gold-reg")}  />
            </div>
          </Tab>
        }
        <Tab key="tasks" value={ROUTES.TASKS} tabContainerClassName={s(`header-small-tab ${!showAISuggest ?'ml-auto' : ''}`)}>
          <div className={s("header-badge-container bg-gray-xlight")}>
            <MdNotificationsActive />
            <Badge count={numTasks} size="sm" className={s("bg-red-500")}  />
          </div>
        </Tab>
        <Tab key="profile" value={ROUTES.PROFILE} tabContainerClassName={s("mx-reg")}>
          <PlaceholderImg
            name={`${user.firstname} ${user.lastname}`}
            src={user.profilePicture}
            className={s('header-profile-picture')}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Header;