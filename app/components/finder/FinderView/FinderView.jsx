import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { DragDropContext } from 'react-beautiful-dnd';

import { Loader } from 'components/common';

import { usePrevious } from 'utils/react';
import { getStyleApplicationFn } from 'utils/style';
import { FINDER, SEARCH, CARD, ANIMATE, WINDOW } from 'appConstants';

import FinderHeader from '../FinderHeader';
import FinderSideNav from '../FinderSideNav';
import FinderBody from '../FinderBody';
import FinderFooter from '../FinderFooter';
import FinderConfirmModals from '../FinderConfirmModals';

const s = getStyleApplicationFn();

const FinderView = ({
  finderId,
  startNodeId,
  isModal,
  onPrimaryClick,
  onSecondaryClick,

  activePath,
  nodes,
  selectedNodeIds,
  hasReachedSegmentLimit,
  isSearchingSegment,
  ownUserId,
  bookmarkIds,

  initFinder,
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards,
  updateSelectedFinderNodes,
  updateDraggingFinderNode
}) => {
  useEffect(() => {
    initFinder(finderId, startNodeId);
  }, [finderId, startNodeId, initFinder]);

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
        requestGetFinderNode(finderId);
        break;
      }
      case FINDER.PATH_TYPE.SEGMENT: {
        querySegment(true);
        break;
      }
      default:
        break;
    }
  }, [finderId, activePath, requestGetFinderNode, querySegment]);

  const [debouncedLoadFinderContent] = useDebouncedCallback(() => {
    loadFinderContent();
  }, ANIMATE.DEBOUNCE.MS_300);

  const prevPath = usePrevious(activePath);
  useEffect(() => {
    if (activePath) {
      const prevPathId = prevPath && prevPath._id;
      if (prevPathId !== activePath._id) {
        // Changed "page" in the history
        loadFinderContent();
      } else {
        // Some other change, including search text, filters, etc.
        debouncedLoadFinderContent();
      }
    }
  }, [activePath, loadFinderContent, debouncedLoadFinderContent]);

  const unselectAll = useCallback(() => {
    updateSelectedFinderNodes(finderId, []);
  }, [finderId, updateSelectedFinderNodes]);

  const onUnselect = (event) => {
    if (!event.defaultPrevented) {
      unselectAll();
    }
  };

  useEffect(() => {
    const onWindowKeyDown = (event) => {
      if (!event.defaultPrevented && event.keyCode === WINDOW.KEY_CODES.ESCAPE) {
        unselectAll();
      }
    };

    window.addEventListener('keydown', onWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, [unselectAll]);

  const onDragStart = ({ draggableId }) => {
    const selected = selectedNodeIds.find((nodeId) => nodeId === draggableId);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      updateSelectedFinderNodes(finderId, [draggableId]);
    }

    updateDraggingFinderNode(finderId, draggableId);
  };

  const onDragEnd = ({ source, destination, reason }) => {
    // nothing to do
    if (!destination || reason === 'CANCEL') {
      updateDraggingFinderNode(finderId, null);
      return;
    }

    // TODO: handle move
    updateDraggingFinderNode(finderId, null);
  };

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

  const render = () => {
    return (
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div
          className={s('relative min-h-0 flex-1 flex flex-col')}
          onClick={onUnselect}
          onTouchEnd={onUnselect}
        >
          {activePath ? (
            <>
              <FinderHeader finderId={finderId} isModal={isModal} />
              <div className={s('min-h-0 flex-1 flex')}>
                <FinderSideNav finderId={finderId} isModal={isModal} />
                <FinderBody
                  finderId={finderId}
                  isModal={isModal}
                  nodes={nodes}
                  onBottom={onBottom}
                />
              </div>
              <FinderFooter
                finderId={finderId}
                onPrimaryClick={onPrimaryClick}
                onSecondaryClick={onSecondaryClick}
                nodes={nodes}
              />
              <FinderConfirmModals finderId={finderId} />
            </>
          ) : (
            <Loader />
          )}
        </div>
      </DragDropContext>
    );
  };

  return render();
};

FinderView.propTypes = {
  finderId: PropTypes.string.isRequired,
  isModal: PropTypes.bool,
  startNodeId: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,

  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(FINDER.PATH_TYPE)).isRequired,
    state: PropTypes.object
  }),
  selectedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  ownUserId: PropTypes.string.isRequired,
  bookmarkIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasReachedSegmentLimit: PropTypes.bool.isRequired,
  isSearchingSegment: PropTypes.bool,

  // Redux Actions
  initFinder: PropTypes.func.isRequired,
  requestGetFinderNode: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestSearchCards: PropTypes.func.isRequired,
  updateSelectedFinderNodes: PropTypes.func.isRequired,
  updateDraggingFinderNode: PropTypes.func.isRequired
};

FinderView.defaultProps = {
  startNodeId: FINDER.ROOT,
  isModal: false
};

export default FinderView;
