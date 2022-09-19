import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

import { Badge } from 'components/common';

import { KEY_CODES } from 'appConstants/window';
import { wasCommandKeyUsed } from 'utils/window';
import { getDraggableStyle } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';

import style from './finder-draggable.css';

const s = getStyleApplicationFn(style);

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;

const FinderDraggable = ({
  node,
  finderId,
  index,
  children,
  isDragDisabled,
  isMultiSelectDisabled,
  width,
  nodes,
  selectedNodes,
  draggingNode,
  updateSelectedFinderNodes,
  className,
  windowPosition
}) => {
  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event) => event.shiftKey;

  const toggleSelection = () => {
    updateSelectedFinderNodes(finderId, [node]);
  };

  const toggleSelectionInGroup = () => {
    const selectedIndex = selectedNodes.findIndex(({ _id }) => _id === node._id);

    if (selectedIndex === -1) {
      // if not selected - add it to the selected items
      updateSelectedFinderNodes(finderId, [...selectedNodes, node]);
    } else {
      // it was previously selected and now needs to be removed from the group
      const shallow = [...selectedNodes];
      shallow.splice(selectedIndex, 1);
      updateSelectedFinderNodes(finderId, shallow);
    }
  };

  const multiSelect = () => {
    // Nothing already selected
    if (!selectedNodes.length) {
      return [node];
    }

    const lastSelectedId = selectedNodes[selectedNodes.length - 1]._id;
    const lastSelectedIndex = nodes.findIndex(({ _id }) => _id === lastSelectedId);

    // nothing to do here
    if (index === lastSelectedIndex) {
      return null;
    }

    const isSelectingForwards = index > lastSelectedIndex;
    const start = isSelectingForwards ? lastSelectedIndex : index;
    const end = isSelectingForwards ? index : lastSelectedIndex;

    const inBetween = nodes.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween.filter(({ _id: nodeId }) => {
      // if already selected: then no need to select it again
      return !selectedNodes.some(({ _id }) => _id === nodeId);
    });

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    const combined = [...selectedNodes, ...sorted];

    return combined;
  };

  // This behaviour matches the MacOSX finder selection
  const multiSelectTo = () => {
    const updated = multiSelect();
    if (updated) {
      updateSelectedFinderNodes(finderId, updated);
    }
  };

  const performAction = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isMultiSelectDisabled) {
      toggleSelection();
    } else if (wasCommandKeyUsed(event)) {
      toggleSelectionInGroup();
    } else if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo();
    } else {
      toggleSelection();
    }
  };

  const onKeyDown = (event, provided, snapshot) => {
    if (!event.defaultPrevented && !snapshot.isDragging && event.keyCode === KEY_CODES.ENTER) {
      // we are using the event for selection
      event.preventDefault();
      performAction(event);
    }
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  const onClick = (event) => {
    if (!event.defaultPrevented && event.button === primaryButton) {
      // marking the event as used
      event.preventDefault();
      performAction(event);
    }
  };

  const onTouchEnd = (event) => {
    if (!event.defaultPrevented) {
      // marking the event as used
      // we would also need to add some extra logic to prevent the click
      // if this element was an anchor
      event.preventDefault();
      toggleSelectionInGroup();
    }
  };

  const getStyle = (itemStyle, snapshot) => {
    if (!snapshot.isDragging) return { width };

    const draggableStyle = {
      ...getDraggableStyle(true, itemStyle, windowPosition),
      width
    };

    if (!snapshot.isDropAnimating) {
      return draggableStyle;
    }

    return {
      ...draggableStyle,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`
    };
  };

  const render = () => {
    const selectionCount = selectedNodes.length;
    const isSelected = selectedNodes.some(({ _id }) => _id === node._id);
    const isHidden = draggingNode && isSelected && node._id !== draggingNode._id;

    return (
      <Draggable draggableId={node._id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => {
          const shouldShowSelection = snapshot.isDragging && selectionCount > 1;
          return (
            <>
              {snapshot.isDragging && (
                <div style={{ width }} className={s(`${className} invisible`)} />
              )}
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={onClick}
                onTouchEnd={onTouchEnd}
                onKeyDown={(event) => onKeyDown(event, provided, snapshot)}
                className={s(`
                  finder-draggable
                  ${className}
                  ${isSelected && !snapshot.isDragging ? 'finder-draggable-selected' : ''}
                  ${snapshot.isDragging ? 'finder-draggable-dragging' : ''}
                  ${isHidden ? 'invisible' : ''}
                `)}
                style={getStyle(provided.draggableProps.style, snapshot)}
              >
                {children}
                {shouldShowSelection && (
                  <Badge count={selectionCount} className={s('bg-purple-reg')} />
                )}
              </div>
            </>
          );
        }}
      </Draggable>
    );
  };

  return render();
};

FinderDraggable.propTypes = {
  node: NodePropTypes.isRequired,
  finderId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  isDragDisabled: PropTypes.bool,
  isMultiSelectDisabled: PropTypes.bool,
  width: PropTypes.number.isRequired,
  nodes: PropTypes.arrayOf(NodePropTypes).isRequired,

  // Redux State
  selectedNodes: PropTypes.arrayOf(NodePropTypes).isRequired,
  draggingNode: NodePropTypes,
  windowPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),

  // Redux Actions
  updateSelectedFinderNodes: PropTypes.func.isRequired
};

FinderDraggable.defaultProps = {
  className: '',
  isDragDisabled: false,
  isMultiSelectDisabled: false
};

export default FinderDraggable;
