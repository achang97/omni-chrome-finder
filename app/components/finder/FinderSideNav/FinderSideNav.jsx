import React from 'react';
import PropTypes from 'prop-types';
import { Separator } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';

import Home from 'assets/images/finder/home.svg';
import MyCards from 'assets/images/finder/card.svg';
import Bookmarked from 'assets/images/finder/bookmark.svg';

import sideNavStyle from './finder-side-nav.css';
import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle, sideNavStyle);

const FinderSideNav = ({ pushFinderPath }) => {
  const SEGMENTS = [
    {
      label: 'My Cards',
      imgSrc: MyCards,
      onClick: () => console.log('Go to My Cards')
    },
    {
      label: 'Bookmarked',
      imgSrc: Bookmarked,
      onClick: () => console.log('Go to Bookmarked')
    }
  ];

  return (
    <div className={s('flex flex-col py-sm border-r finder-border')}>
      <div className={s('finder-side-nav-section')} onClick={() => pushFinderPath(null)}>
        <img src={Home} alt="Home" />
        <span> Home </span>
      </div>
      <Separator horizontal className={s('my-sm')} />
      <div className={s('flex-1')}>
        {SEGMENTS.map(({ label, imgSrc, onClick }) => (
          <div className={s('finder-side-nav-section')} onClick={onClick}>
            <img src={imgSrc} alt={label} />
            <span> {label} </span>
          </div>
        ))}
      </div>
    </div>
  );
};

FinderSideNav.propTypes = {};

export default FinderSideNav;
