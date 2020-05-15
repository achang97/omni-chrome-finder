import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Loader } from 'components/common';
import { CardStatusIndicator } from 'components/cards';
import { ReactSortable, Sortable, MultiDrag } from 'react-sortablejs';

import { getStyleApplicationFn } from 'utils/style';

import FinderFolder from 'assets/images/finder/folder.svg';
import FinderCard from 'assets/images/finder/card.svg';

import style from './finder-body.css';

const s = getStyleApplicationFn(style);

Sortable.mount(new MultiDrag());

const FinderBody = ({
  nodes,
  isLoading,
  searchText,
  selectedIndices,
  pushFinderNode,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex,
  openCard
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const getNodeLabel = ({ card, name }) => {
    return card ? card.question : name;
  };

  // const filteredNodes = nodes.filter((childNode) => {
  //   const label = getNodeLabel(childNode).toLowerCase().trim();
  //   return label.includes(searchText.toLowerCase().trim());
  // });

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

  const renderChildNode = (childNode, i) => {
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
        <Tooltip tooltip={label} show={!isDragging}>
          <div className={s('line-clamp-2 mt-sm w-full text-xs text-center')}>{label}</div>
        </Tooltip>
      </div>
    );
  };

  const onItemSelect = ({ item }) => {
    console.log(item);
  };

  const onItemDeselect = ({ item }) => {
    console.log(item);
  };

  const getMultiDragKey = () => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    console.log(isUsingWindows);
    return isUsingWindows ? 'CTRL' : 'META';
  };

  const render = () => {
    if (isLoading) {
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
      <ReactSortable
        list={nodes}
        setList={() => console.log('testing')}
        className={s('flex flex-wrap items-start content-start overflow-auto')}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
        multiDrag
        multiDragKey={getMultiDragKey()}
        selectedClass={s('finder-body-selected-node')}
        onSelect={onItemSelect}
        onDeselect={onItemDeselect}
      >
        {nodes.map(renderChildNode)}
      </ReactSortable>
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
  isLoading: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
  selectedIndices: PropTypes.arrayOf(PropTypes.number).isRequired,

  // Redux Actions
  pushFinderNode: PropTypes.func.isRequired,
  selectFinderNodeIndex: PropTypes.func.isRequired,
  toggleSelectedFinderNodeIndex: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

export default FinderBody;
