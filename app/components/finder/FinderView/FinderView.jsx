import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import { UserPropTypes } from 'utils/propTypes';
import { FINDER, SEARCH, CARD } from 'appConstants';

import FinderHeader from '../FinderHeader';
import FinderSideNav from '../FinderSideNav';
import FinderBody from '../FinderBody';
import FinderFooter from '../FinderFooter';

const s = getStyleApplicationFn();

const FinderView = ({ activePath, searchText, user, requestGetFinderNode, clearSearchCards, requestSearchCards }) => {
  const querySegment = (clearCards) => {
    const queryParams = { q: searchText };
    switch (activePath._id) {
      case FINDER.SEGMENT_TYPE.MY_CARDS: {
        queryParams.statuses = Object.values(CARD.STATUS).join(',');
        queryParams.owners = user._id;
        break;
      }
      case FINDER.SEGMENT_TYPE.BOOKMARKED: {
        if (user.bookmarkIds.length === 0) {
          clearSearchCards(SEARCH.TYPE.FINDER);
          return;
        }
        queryParams.statuses = Object.values(CARD.STATUS).join(',');
        queryParams.ids = user.bookmarkIds.join(',');
        break;
      }
      default:
        break;
    }

    requestSearchCards(SEARCH.TYPE.FINDER, queryParams, clearCards);
  };
// 
//   const [debouncedRequestSearch] = useDebouncedCallback(() => {
//     searchCards(true);
//   }, ANIMATE.DEBOUNCE.MS_300);
// 
//   const prevTab = usePrevious(activeTab);
//   const prevTags = usePrevious(filterTags);
// 
//   useEffect(() => {
//     if (prevTab !== activeTab || prevTags !== filterTags) {
//       searchCards(true);
//     } else {
//       debouncedRequestSearch();
//     }
//   }, [activeTab, filterTags, searchText]);

  useEffect(() => {
    if (activePath._id) {
      switch (activePath.type) {
        case FINDER.PATH_TYPE.NODE: {
          requestGetFinderNode(activePath._id);
          break;
        }
        case FINDER.PATH_TYPE.SEGMENT: {
          querySegment(true);
          break;
        }
        default:
          break;
      }
    }
  }, [activePath, requestGetFinderNode]);

  return (
    <>
      <FinderHeader />
      <div className={s('min-h-0 flex-1 flex')}>
        <FinderSideNav />
        <FinderBody />
      </div>
      <FinderFooter />
    </>
  );
};

FinderView.propTypes = {
  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(FINDER.PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  user: UserPropTypes.isRequired,
  searchText: PropTypes.string.isRequired,

  // Redux Actions
  requestGetFinderNode: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestSearchCards: PropTypes.func.isRequired
};

export default FinderView;
