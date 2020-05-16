import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

import { usePrevious } from 'utils/react';
import { getStyleApplicationFn } from 'utils/style';
import { FINDER, SEARCH, CARD, ANIMATE } from 'appConstants';

import FinderHeader from '../FinderHeader';
import FinderSideNav from '../FinderSideNav';
import FinderBody from '../FinderBody';
import FinderFooter from '../FinderFooter';
import FinderConfirmModals from '../FinderConfirmModals';

const s = getStyleApplicationFn();

const FinderView = ({
  activePath,
  hasReachedSegmentLimit,
  isSearchingSegment,
  ownUserId,
  bookmarkIds,
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards
}) => {
  const querySegment = useCallback(
    (clearCards) => {
      const queryParams = { q: activePath.state.searchText };
      switch (activePath._id) {
        case FINDER.SEGMENT_TYPE.MY_CARDS: {
          queryParams.statuses = Object.values(CARD.STATUS).join(',');
          queryParams.owners = ownUserId;
          break;
        }
        case FINDER.SEGMENT_TYPE.BOOKMARKED: {
          if (bookmarkIds.length === 0) {
            clearSearchCards(SEARCH.TYPE.FINDER);
            return;
          }
          queryParams.statuses = Object.values(CARD.STATUS).join(',');
          queryParams.ids = bookmarkIds.join(',');
          break;
        }
        default:
          break;
      }

      requestSearchCards(SEARCH.TYPE.FINDER, queryParams, clearCards);
    },
    [activePath, bookmarkIds, ownUserId, clearSearchCards, requestSearchCards]
  );

  const loadFinderContent = useCallback(() => {
    switch (activePath.type) {
      case FINDER.PATH_TYPE.NODE: {
        requestGetFinderNode();
        break;
      }
      case FINDER.PATH_TYPE.SEGMENT: {
        querySegment(true);
        break;
      }
      default:
        break;
    }
  }, [activePath, requestGetFinderNode, querySegment]);

  const [debouncedLoadFinderContent] = useDebouncedCallback(() => {
    loadFinderContent();
  }, ANIMATE.DEBOUNCE.MS_300);

  const prevPath = usePrevious(activePath);
  useEffect(() => {
    const prevPathId = prevPath && prevPath._id;
    if (prevPathId !== activePath._id) {
      // Changed "page" in the history
      loadFinderContent();
    } else {
      // Some other change, including search text, filters, etc.
      debouncedLoadFinderContent();
    }
  }, [activePath, loadFinderContent, debouncedLoadFinderContent]);

  const onBottom = () => {
    switch (activePath.type) {
      case FINDER.PATH_TYPE.SEGMENT: {
        if (!hasReachedSegmentLimit && !isSearchingSegment) {
          querySegment(false);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className={s('relative min-h-0 flex-1 flex flex-col')}>
      <FinderHeader />
      <div className={s('min-h-0 flex-1 flex')}>
        <FinderSideNav />
        <FinderBody onBottom={onBottom} />
      </div>
      {/* <FinderFooter /> */}
      <FinderConfirmModals />
    </div>
  );
};

FinderView.propTypes = {
  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(FINDER.PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  ownUserId: PropTypes.string.isRequired,
  bookmarkIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasReachedSegmentLimit: PropTypes.bool.isRequired,
  isSearchingSegment: PropTypes.bool.isRequired,

  // Redux Actions
  requestGetFinderNode: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestSearchCards: PropTypes.func.isRequired
};

export default FinderView;
