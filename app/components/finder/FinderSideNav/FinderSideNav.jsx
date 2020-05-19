import React from 'react';
import PropTypes from 'prop-types';
import { Separator } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { ROOT, SEGMENT_TYPE } from 'appConstants/finder';

import Home from 'assets/images/finder/home.svg';
import MyCards from 'assets/images/finder/card.svg';
import Bookmarked from 'assets/images/finder/bookmark.svg';

import sideNavStyle from './finder-side-nav.css';
import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle, sideNavStyle);

const NODES = [
  {
    name: 'Home',
    imgSrc: Home,
    nodeId: ROOT
  }
];

const SEGMENTS = [
  {
    name: 'My Cards',
    imgSrc: MyCards,
    _id: SEGMENT_TYPE.MY_CARDS
  },
  {
    name: 'Bookmarked',
    imgSrc: Bookmarked,
    _id: SEGMENT_TYPE.BOOKMARKED
  }
];

const FinderSideNav = ({ finderId, isModal, activePathId, pushFinderNode, pushFinderSegment }) => {
  const renderSection = (name, imgSrc, id, onClick) => (
    <div
      className={s(
        `finder-side-nav-section ${activePathId === id ? 'finder-side-nav-selected' : ''}`
      )}
      onClick={onClick}
    >
      <img src={imgSrc} alt={name} />
      <span> {name} </span>
    </div>
  );

  return (
    <div className={s('flex flex-col flex-shrink-0 py-sm border-r finder-border')}>
      {NODES.map(({ name, imgSrc, nodeId }) =>
        renderSection(name, imgSrc, nodeId, () => pushFinderNode(finderId, nodeId))
      )}
      {!isModal && (
        <>
          <Separator horizontal className={s('my-sm')} />
          <div className={s('flex-1')}>
            {SEGMENTS.map(({ name, imgSrc, _id }) =>
              renderSection(name, imgSrc, _id, () => pushFinderSegment(finderId, _id, name))
            )}
          </div>
        </>
      )}
    </div>
  );
};

FinderSideNav.propTypes = {
  finderId: PropTypes.string.isRequired,
  isModal: PropTypes.bool.isRequired,

  // Redux State
  activePathId: PropTypes.string.isRequired,

  // Redux Actions
  pushFinderNode: PropTypes.func.isRequired,
  pushFinderSegment: PropTypes.func.isRequired
};

export default FinderSideNav;
