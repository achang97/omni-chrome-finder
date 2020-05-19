import React from 'react';
import PropTypes from 'prop-types';
import { MdSettings } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Droppable } from 'react-beautiful-dnd';

import { Tooltip, Loader } from 'components/common';
import { CardStatusIndicator } from 'components/cards';

import { MODAL_TYPE, PATH_TYPE } from 'appConstants/finder';
import { getStyleApplicationFn } from 'utils/style';

import FinderFolder from 'assets/images/finder/folder.svg';
import FinderCard from 'assets/images/finder/card.svg';
import MoveFolder from 'assets/images/finder/move-folder.svg';

import style from './finder-body.css';

import FinderDraggable from '../FinderDraggable';
import FinderDroppable from '../FinderDroppable';

const s = getStyleApplicationFn(style);

const INFINITE_SCROLL_OFFSET = 300;

const FinderBody = ({
  finderId,
  isModal,
  nodes,
  activePath,
  isGettingNode,
  isSearchingSegment,
  segmentPage,
  selectedNodeIds,
  moveNodeIds,
  draggingNodeId,
  pushFinderNode,
  openFinderModal,
  updateSelectedFinderNodes,
  openCard,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups,
  onBottom
}) => {
  const getNodeLabel = ({ card, name }) => {
    return card ? card.question : name;
  };

  const isMovingNode = (nodeId) => {
    return moveNodeIds.includes(nodeId);
  };

  const openNode = ({ card, _id }) => {
    if (card) {
      openCard({ _id: card._id });
    } else if (!isMovingNode(_id)) {
      pushFinderNode(finderId, _id);
    }
  };

  const renderChildNode = (childNode, i) => {
    const { card, _id } = childNode;
    const label = getNodeLabel(childNode);
    const isMoving = isMovingNode(_id);
    const nodeIds = nodes.map(({ _id: nodeId }) => nodeId);
    const isDraggable = activePath.type === PATH_TYPE.NODE;

    return (
      <FinderDraggable
        key={_id}
        id={_id}
        index={i}
        isDragDisabled={!isDraggable}
        isMultiSelectDisabled={isModal || moveNodeIds.length !== 0}
        draggingNodeId={draggingNodeId}
        nodeIds={nodeIds}
        selectedNodeIds={selectedNodeIds}
        onSelectFinderNodes={(selectedIds) => updateSelectedFinderNodes(finderId, selectedIds)}
      >
        <div className={s(`finder-body-node`)} onDoubleClick={() => openNode(childNode)}>
          <div className={s('relative')}>
            <img src={card ? FinderCard : FinderFolder} alt={label} />
            {isMoving && (
              <div className={s('finder-body-node-move-indicator')}>
                <img src={MoveFolder} alt="Move Node" className={s('h-full w-full')} />
              </div>
            )}
            {card && (
              <CardStatusIndicator
                status={card.status}
                className={s('finder-body-node-status-indicator')}
              />
            )}
          </div>
          <Tooltip tooltip={label}>
            <div className={s('line-clamp-2 mt-sm w-full text-xs text-center')}>{label}</div>
          </Tooltip>
        </div>
      </FinderDraggable>
    );
  };

  const renderActionIcons = () => {
    if (moveNodeIds.length !== 0) {
      return null;
    }

    const selectedNode = nodes.find(({ _id }) => _id === selectedNodeIds[0]);
    const ICONS = [
      {
        label: 'Edit',
        Icon: MdSettings,
        show: selectedNodeIds.length === 1 && selectedNode && !selectedNode.card,
        onClick: () => {
          updateFinderFolderName(finderId, selectedNode.name);
          openFinderModal(finderId, MODAL_TYPE.EDIT_FOLDER);
          // updateFinderFolderPermissions(finderId);
          // updateFinderFolderPermissionGroups(finderId, []);
        }
      },
      {
        label: 'Delete',
        Icon: FaRegTrashAlt,
        show: selectedNodeIds.length !== 0,
        onClick: () => openFinderModal(finderId, MODAL_TYPE.CONFIRM_DELETE)
      }
    ];

    return (
      <div
        className={s('absolute bottom-0 right-0 flex items-end p-reg')}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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
      <div className={s('relative w-full flex flex-col')}>
        {activePath.state.searchText && (
          <div className={s('italic bg-gray-xlight px-lg py-xs text-xs')}>
            Results for &quot;{activePath.state.searchText}&quot;
          </div>
        )}
        <BottomScrollListener onBottom={onBottom} bottomOffset={INFINITE_SCROLL_OFFSET}>
          {(scrollRef) => (
            <div ref={scrollRef} className={s('flex-1 overflow-auto flex flex-col')}>
              <Droppable droppableId={activePath._id} direction="horizontal">
                {({ innerRef, placeholder, droppableProps }) => (
                  <div
                    ref={innerRef}
                    className={s('flex-1 flex flex-wrap items-start content-start')}
                    {...droppableProps}
                  >
                    {nodes.map(renderChildNode)}
                    <span className={s('hidden')}>{placeholder}</span>
                  </div>
                )}
              </Droppable>
              {isSearchingSegment && <Loader className={s('my-reg')} size="sm" />}
            </div>
          )}
        </BottomScrollListener>
        {renderActionIcons()}
      </div>
    );
  };

  return render();
};

FinderBody.propTypes = {
  isModal: PropTypes.bool.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      card: PropTypes.object
    })
  ).isRequired,

  // Redux State
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  isGettingNode: PropTypes.bool,
  isSearchingSegment: PropTypes.bool,
  segmentPage: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selectedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  draggingNodeId: PropTypes.string,

  // Redux Actions
  pushFinderNode: PropTypes.func.isRequired,
  openFinderModal: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  updateFinderFolderName: PropTypes.func.isRequired,
  updateFinderFolderPermissions: PropTypes.func.isRequired,
  updateFinderFolderPermissionGroups: PropTypes.func.isRequired
};

export default FinderBody;
