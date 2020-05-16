import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdSettings } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Tooltip, Loader } from 'components/common';
import { CardStatusIndicator } from 'components/cards';
import { ReactSortable, Sortable, MultiDrag } from 'react-sortablejs';
import BottomScrollListener from 'react-bottom-scroll-listener';

import { MODAL_TYPE } from 'appConstants/finder';
import { getStyleApplicationFn } from 'utils/style';

import FinderFolder from 'assets/images/finder/folder.svg';
import FinderCard from 'assets/images/finder/card.svg';

import style from './finder-body.css';

const s = getStyleApplicationFn(style);

const multiDragPlugin = new MultiDrag();
Sortable.mount(multiDragPlugin);

const INFINITE_SCROLL_OFFSET = 300;

const FinderBody = ({
  nodes,
  searchText,
  isGettingNode,
  isSearchingSegment,
  segmentPage,
  selectedIndices,
  pushFinderNode,
  updateSelectedFinderIndices,
  openFinderModal,
  openCard,
  onBottom
}) => {
  const getNodeLabel = ({ card, name }) => {
    return card ? card.question : name;
  };

  useEffect(() => {
    const onWindowKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft': {
          console.log('left');
          break;
        }
        case 'ArrowUp': {
          console.log('up');
          break;
        }
        case 'ArrowRight': {
          console.log('right');
          break;
        }
        case 'ArrowDown': {
          console.log('down');
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', onWindowKeyDown);

    // NOTE: This is a hacky solution (but no good options provided by library).
    // eslint-disable-next-line no-underscore-dangle
    const deselectMultiDrag = multiDragPlugin.prototype._deselectMultiDrag;
    document.removeEventListener('pointerup', deselectMultiDrag, false);
    document.removeEventListener('mouseup', deselectMultiDrag, false);
    document.removeEventListener('touchend', deselectMultiDrag, false);

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, []);

  const openNode = ({ card, _id }) => {
    if (card) {
      openCard({ _id: card._id });
    } else {
      pushFinderNode(_id);
    }
  };

  const renderChildNode = (childNode) => {
    const { card, _id } = childNode;
    const label = getNodeLabel(childNode);
    return (
      <div
        key={_id || card._id}
        className={s(`finder-body-node`)}
        onDoubleClick={() => openNode(childNode)}
        tabIndex="0"
        role="button"
      >
        <div className={s('relative')}>
          <img src={card ? FinderCard : FinderFolder} alt={label} />
          {card && (
            <CardStatusIndicator
              status={card.status}
              className={s('finder-body-node-status-indicator')}
            />
          )}
        </div>
        {/* TODO: onClick allow them to change folder name */}
        <Tooltip tooltip={label}>
          <div className={s('line-clamp-2 mt-sm w-full text-xs text-center')}>{label}</div>
        </Tooltip>
      </div>
    );
  };

  const renderActionIcons = () => {
    const ICONS = [
      {
        label: 'Edit',
        Icon: MdSettings,
        show: true, // selectedIndices.length === 1 && !nodes[selectedIndices[0]].card,
        onClick: () => console.log('Editing')
      },
      {
        label: 'Delete',
        Icon: FaRegTrashAlt,
        show: true, // selectedIndices.length !== 0,
        onClick: () => {
          console.log('testing')
          openFinderModal(MODAL_TYPE.CONFIRM_DELETE)
        }
      }
    ];

    return (
      <div
        className={s('fixed bottom-0 right-0 flex items-end p-reg')}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {ICONS.filter(({ show }) => show).map(({ label, Icon, onClick }, i) => (
          <div
            key={label}
            onClick={onClick}
            className={s(
              `text-purple-reg flex flex-col items-center cursor-pointer ${
                i !== ICONS.length - 1 ? 'mr-lg' : ''
              }`
            )}
          >
            <Icon className={s('text-xl mb-xs')} />
            <div className={s('text-xs')}> {label} </div>
          </div>
        ))}
      </div>
    );
  };

  const getMultiDragKey = () => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? 'Control' : 'Meta';
  };

  const setList = (test) => {
    console.log(test);
  };

  const handleNewIndices = ({ newIndicies, ...rest }) => {
    console.log(rest)
    const indices = newIndicies.map(({ index }) => index);
    updateSelectedFinderIndices(indices);
  };

  const render = () => {
    if (isGettingNode || (isSearchingSegment && segmentPage === 0)) {
      return <Loader className={s('w-full')} />;
    }

    if (nodes.length === 0) {
      return (
        <div className={s('flex items-center justify-center w-full h-full text-gray-dark')}>
          Nothing to display
        </div>
      );
    }

    return (
      <BottomScrollListener onBottom={onBottom} bottomOffset={INFINITE_SCROLL_OFFSET}>
        {(scrollRef) => (
          <div ref={scrollRef} className={s('overflow-auto w-full relative')}>
            {searchText && (
              <div className={s('italic bg-gray-xlight px-lg py-xs text-xs')}>
                Results for &quot;{searchText}&quot;
              </div>
            )}
            <ReactSortable
              list={nodes}
              setList={setList}
              multiDrag
              multiDragKey={getMultiDragKey()}
              selectedClass={s('finder-body-selected-node')}
              ghostClass={s('invisible')}
              className={s('flex flex-wrap items-start content-start')}
              // onSelect={handleNewIndices}
              // onDeselect={handleNewIndices}
              onMouseUp={() => console.log('testing')}
            >
              {nodes.map(renderChildNode)}
            </ReactSortable>
            {isSearchingSegment && <Loader className={s('my-reg')} size="sm" />}
            {renderActionIcons()}
          </div>
        )}
      </BottomScrollListener>
    );
  };

  return render();
};

FinderBody.propTypes = {
  // Redux State
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      card: PropTypes.object
    })
  ).isRequired,
  searchText: PropTypes.string.isRequired,
  isGettingNode: PropTypes.bool,
  isSearchingSegment: PropTypes.bool,
  segmentPage: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selectedIndices: PropTypes.arrayOf(PropTypes.number).isRequired,

  // Redux Actions
  pushFinderNode: PropTypes.func.isRequired,
  updateSelectedFinderIndices: PropTypes.func.isRequired,
  openFinderModal: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default FinderBody;
