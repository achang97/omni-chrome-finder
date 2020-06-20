import React from 'react';
import PropTypes from 'prop-types';
import { Separator } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { FINDER, SEGMENT } from 'appConstants';

import Home from 'assets/images/finder/home.svg';
import MyCards from 'assets/images/finder/card.svg';
import Bookmarked from 'assets/images/finder/bookmark.svg';

import sideNavStyle from './finder-side-nav.css';
import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle, sideNavStyle);

const NODES = {
  type: FINDER.PATH_TYPE.NODE,
  nodes: [
    {
      name: FINDER.ROOT.NAME,
      imgSrc: Home,
      _id: FINDER.ROOT.ID
    }
  ]
};

const SEGMENTS = {
  type: FINDER.PATH_TYPE.SEGMENT,
  nodes: [
    {
      name: 'My Cards',
      imgSrc: MyCards,
      _id: FINDER.SEGMENT_TYPE.MY_CARDS
    },
    {
      name: 'Bookmarked',
      imgSrc: Bookmarked,
      _id: FINDER.SEGMENT_TYPE.BOOKMARKED
    }
  ]
};

const FinderSideNav = ({
  finderId,
  isModal,
  activePathId,
  pushFinderNode,
  pushFinderSegment,
  trackEvent
}) => {
  const renderSection = ({ type, nodes }) => {
    let onClick;
    switch (type) {
      case FINDER.PATH_TYPE.SEGMENT: {
        onClick = (_id, name) => {
          pushFinderSegment(finderId, _id, name);
          trackEvent(SEGMENT.EVENT.CLICK_SEGMENT, { 'Segment Name': name });
        };
        break;
      }
      case FINDER.PATH_TYPE.NODE: {
        onClick = (_id, name) => {
          pushFinderNode(finderId, _id);
          trackEvent(SEGMENT.EVENT.CLICK_FOLDER, { 'Folder Name': name });
        };
        break;
      }
      default:
        break;
    }

    return nodes.map(({ _id, name, imgSrc }) => (
      <div
        className={s(
          `finder-side-nav-section ${activePathId === _id ? 'finder-side-nav-selected' : ''}`
        )}
        onClick={() => onClick(_id, name)}
        key={_id}
      >
        <img src={imgSrc} alt={name} />
        <span> {name} </span>
      </div>
    ));
  };

  return (
    <div className={s('flex flex-col flex-shrink-0 py-sm border-0 border-r finder-border')}>
      {renderSection(NODES)}
      {!isModal && (
        <>
          <Separator horizontal className={s('my-sm')} />
          <div className={s('flex-1')}>{renderSection(SEGMENTS)}</div>
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
  pushFinderSegment: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default FinderSideNav;
