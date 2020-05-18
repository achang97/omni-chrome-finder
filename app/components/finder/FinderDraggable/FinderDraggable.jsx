import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Badge } from 'components/common';

import { KEY_CODES } from 'appConstants/window';
import { getDraggableStyle } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';

import style from './finder-draggable.css';

const s = getStyleApplicationFn(style);

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;

const FinderDraggable = ({
  id,
  index,
  children,
  isSelected,
  isGhosting,
  disabled,
  nodeIds,

  selectedNodeIds,
  draggingNodeId,
  windowPosition,
  updateSelectedFinderNodes
}) => {
  // Determines if the platform specific toggle selection in group key was used
  const wasToggleInSelectionGroupKeyUsed = (event) => {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event) => event.shiftKey;

  const toggleSelection = () => {
    updateSelectedFinderNodes([id]);
  };

  const toggleSelectionInGroup = () => {
    const index = selectedNodeIds.indexOf(id);

    if (index === -1) {
      // if not selected - add it to the selected items
      updateSelectedFinderNodes([...selectedNodeIds, id]);
    } else {
      // it was previously selected and now needs to be removed from the group
      const shallow = [...selectedNodeIds];
      shallow.splice(index, 1);
      updateSelectedFinderNodes(shallow);
    }
  };

  const multiSelect = () => {
    // Nothing already selected
    if (!selectedNodeIds.length) {
      return [id];
    }

    const lastSelectedId = selectedNodeIds[selectedNodeIds.length - 1];
    const lastSelectedIndex = nodeIds.findIndex((nodeId) => nodeId === lastSelectedId);

    // nothing to do here
    if (index === lastSelectedIndex) {
      return null;
    }

    const isSelectingForwards = index > lastSelectedIndex;
    const start = isSelectingForwards ? lastSelectedIndex : index;
    const end = isSelectingForwards ? index : lastSelectedIndex;

    const inBetween = nodeIds.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween.filter((taskId) => {
      // if already selected: then no need to select it again
      return !selectedNodeIds.includes(taskId);
    });

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    const combined = [...selectedNodeIds, ...sorted];

    return combined;
  };

  // This behaviour matches the MacOSX finder selection
  const multiSelectTo = () => {
    const updated = multiSelect();
    if (updated) {
      updateSelectedFinderNodes(updated);
    }
  };

  const performAction = (event) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
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

  const getStyle = (style, snapshot) => {
    if (!snapshot.isDragging) return {};

    const draggableStyle = getDraggableStyle(true, style, windowPosition);
    if (!snapshot.isDropAnimating) {
      return draggableStyle;
    }

    return {
      ...draggableStyle,
      // cannot be 0, but make it super tiny
      transitionDuration: `0.001s`
    };
  }

  const render = () => {
    const selectionCount = selectedNodeIds.length;
    const isSelected = selectedNodeIds.includes(id);
    const isHidden = draggingNodeId && isSelected && id !== draggingNodeId;

    return (
      <Draggable draggableId={id} index={index} isDragDisabled={disabled}>
        {(provided, snapshot) => {
          const shouldShowSelection = snapshot.isDragging && selectionCount > 1;
          console.log(snapshot.combineWith, snapshot.draggingOver)
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={onClick}
              onTouchEnd={onTouchEnd}
              onKeyDown={(event) => onKeyDown(event, provided, snapshot)}
              className={s(`
                finder-draggable
                ${isSelected ? 'finder-draggable-selected' : ''}
                ${snapshot.isDragging ? 'opacity-75' : ''}
                ${isHidden ? 'invisible': ''}
              `)}
              style={getStyle(provided.draggableProps.style, snapshot)}
            >
              {children}
              {shouldShowSelection && (
                <Badge count={selectionCount} className={s('bg-purple-reg')} />
              )}
            </div>
          );
        }}
      </Draggable>
    );
  };

  return render();
}

export default FinderDraggable;
