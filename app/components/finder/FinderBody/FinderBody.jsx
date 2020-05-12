import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'components/common';
import { ReactSortable, Sortable, MultiDrag } from 'react-sortablejs';

import { getStyleApplicationFn } from 'utils/style';

import FinderFolder from 'assets/images/finder/folder.svg';
import FinderCard from 'assets/images/finder/card.svg';

import style from './finder-body.css';

const s = getStyleApplicationFn(style);

Sortable.mount(new MultiDrag());

const FinderBody = ({
  activePath: { children },
  searchText,
  selectedIndices,
  pushFinderPath,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const getNodeLabel = ({ card, name }) => {
    return card ? card.question : name;
  };

  const filteredChildren = children.filter((childNode) => {
    const label = getNodeLabel(childNode).toLowerCase().trim();
    return label.includes(searchText.toLowerCase().trim());
  });

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

  const openNode = (childNode) => {
    if (childNode.card) {
      // Open Card
      console.log('Opening Card!');
    } else {
      // Descend into directory
      pushFinderPath(childNode);
    }
  };

  const renderChildNode = (childNode, i) => {
    const { card, id } = childNode;
    const label = getNodeLabel(childNode);
    return (
      <div
        key={id}
        className={s(`finder-body-node`)}
        onDoubleClick={() => openNode(childNode)}
        tabIndex="0"
        role="button"
      >
        <img src={card ? FinderCard : FinderFolder} alt={label} />
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

  return (
    <ReactSortable
      list={filteredChildren}
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
      {filteredChildren.map(renderChildNode)}
    </ReactSortable>
  );
};

FinderBody.propTypes = {
  activePath: PropTypes.shape({
    name: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.object
  }).isRequired,
  searchText: PropTypes.string.isRequired,
  selectedIndices: PropTypes.arrayOf(PropTypes.number).isRequired,

  pushFinderPath: PropTypes.func.isRequired,
  selectFinderNodeIndex: PropTypes.func.isRequired,
  toggleSelectedFinderNodeIndex: PropTypes.func.isRequired
};

export default FinderBody;
