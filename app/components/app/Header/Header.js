import React from 'react';
import { MdNotificationsActive, MdLightbulbOutline } from 'react-icons/md';

import { Tabs, Tab, Badge, PlaceholderImg } from 'components/common';
import { ROUTES } from 'appConstants';

import { colors } from 'styles/colors';
import style from './header.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const Header = ({
  user, numAISuggestCards, numTasks,
  history, location: { pathname }
}) => {
  const handleTabClick = (activeLink) => {
    history.push(activeLink);
  }

  const showAISuggest = numAISuggestCards !== 0;
  return (
    <div className={s('px-sm bg-purple-xlight')}>
      <Tabs
        onTabClick={handleTabClick}
        activeValue={pathname}
        tabClassName={s('text-md py-xl px-0 font-semibold flex items-center')}
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
          <PlaceholderImg name={`${user.firstname} ${user.lastname}`} src={user.img} className={s('header-profile-picture')} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Header;