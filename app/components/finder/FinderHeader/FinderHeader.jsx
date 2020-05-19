import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight, MdChevronLeft, MdSearch } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import { FiPlus } from 'react-icons/fi';

import { Dropdown, ContextMenu, CircleButton } from 'components/common';
import { getNewCardBaseState } from 'utils/card';
import { UserPropTypes } from 'utils/propTypes';
import { getStyleApplicationFn } from 'utils/style';
import { FINDER, ROUTES } from 'appConstants';

import MoveFolder from 'assets/images/finder/move-folder.svg';

import finderStyle from '../finder.css';
import headerStyle from './finder-header.css';

const s = getStyleApplicationFn(finderStyle, headerStyle);

const FinderHeader = ({
  finderId,
  isModal,
  isBackDisabled,
  activePath,
  activeNode,
  selectedNodeIds,
  moveNodeIds,
  isTemplateView,
  user,
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal,
  startMoveFinderNodes,
  openCard,
  toggleCards,
  toggleTemplateView,
  updateCreatePath,
  history
}) => {
  const [isNewDropdownOpen, setNewDropdownOpen] = useState(false);

  const renderNavigationSection = () => {
    let mainSectionName;
    switch (activePath.type) {
      case FINDER.PATH_TYPE.NODE: {
        mainSectionName = activeNode.name;
        break;
      }
      case FINDER.PATH_TYPE.SEGMENT: {
        mainSectionName = activePath.state.name;
        break;
      }
      default:
        break;
    }

    return (
      <div className={s('w-1/2 flex items-center min-w-0')}>
        <CircleButton
          buttonClassName={s('finder-header-icon')}
          content={<MdChevronLeft />}
          onClick={() => goBackFinder(finderId)}
          disabled={isBackDisabled}
          size="auto"
        />
        {mainSectionName && (
          <div className={s('finder-header-icon min-w-0 flex items-center ml-reg text-sm')}>
            {activeNode.parent && (
              <>
                <div
                  className={s('truncate cursor-pointer')}
                  onClick={() => pushFinderNode(finderId, activeNode.parent._id)}
                >
                  {activeNode.parent.name}
                </div>
                <MdChevronRight className={s('mx-xs')} />
              </>
            )}
            <div className={s('truncate')}> {mainSectionName} </div>
          </div>
        )}
      </div>
    );
  };

  const getFullPath = () => {
    // TODO: this will probably be simplified when we get data
    const fullPath = [];
    let currNode = activeNode;
    while (currNode && currNode._id !== FINDER.ROOT) {
      const { name, _id } = currNode;
      fullPath.unshift({ name, _id });
      currNode = currNode.parent;
    }
    return fullPath;
  };

  const renderActionSection = () => {
    const isSegment = activePath.type === FINDER.PATH_TYPE.SEGMENT;
    const fullPath = isSegment ? [] : getFullPath();
    const isMoving = moveNodeIds.length !== 0;

    const onClickWrapper = (onClick) => {
      return () => {
        onClick();
        setNewDropdownOpen(false);
      };
    };

    const onTemplateClick = () => {
      history.push(ROUTES.CREATE);
      toggleCards();
      updateCreatePath(fullPath);
      if (!isTemplateView) {
        toggleTemplateView();
      }
    };

    // TODO: account for current "path" and pass that to template and new blank card
    const CONTEXT_MENU_OPTIONS = [
      {
        label: 'New Card',
        options: [
          {
            label: 'Blank Card',
            onClick: onClickWrapper(() => {
              const newCard = { ...getNewCardBaseState(user), path: fullPath };
              openCard(newCard, true);
            })
          },
          {
            label: 'From Template',
            onClick: onClickWrapper(onTemplateClick)
          }
        ],
        showModal: false
      },
      {
        label: 'New Folder',
        onClick: onClickWrapper(() => openFinderModal(finderId, FINDER.MODAL_TYPE.CREATE_FOLDER)),
        disabled: isSegment,
        showModal: true
      }
    ];

    const filteredContextMenuOptions = CONTEXT_MENU_OPTIONS.filter(
      ({ showModal }) => !isModal || showModal
    );

    return (
      <div className={s('w-1/2 flex items-center ml-sm')}>
        <Dropdown
          isOpen={isNewDropdownOpen}
          onToggle={setNewDropdownOpen}
          isLeft={false}
          toggler={
            <CircleButton
              size="auto"
              buttonClassName={s('finder-header-icon mr-sm')}
              content={<FiPlus />}
            />
          }
          body={
            <ContextMenu
              options={filteredContextMenuOptions}
              outerClassName={s('mt-sm')}
              className={s('finder-header-new-dropdown')}
            />
          }
        />
        {!isModal && (
          <CircleButton
            size="auto"
            buttonClassName={s('finder-header-icon mr-sm')}
            content={<img src={MoveFolder} alt="Move Folder" />}
            disabled={isSegment || selectedNodeIds.length === 0 || isMoving}
            onClick={() => startMoveFinderNodes(finderId)}
          />
        )}
        <div className={s('finder-header-input-container')}>
          <MdSearch className={s('flex-shrink-0')} />
          <input
            placeholder="Search"
            className={s('border-0 shadow-none min-w-0 flex-shrink')}
            value={activePath.state.searchText}
            onChange={(e) => updateFinderSearchText(finderId, e.target.value)}
          />
          {activePath.state.searchText && (
            <IoMdCloseCircle
              onClick={() => updateFinderSearchText(finderId, '')}
              className={s('flex-shrink-0 m-xs cursor-pointer text-purple-gray-50')}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={s('px-lg py-reg rounded-t-lg border-b finder-border flex items-center')}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {renderNavigationSection()}
      {renderActionSection()}
    </div>
  );
};

FinderHeader.propTypes = {
  finderId: PropTypes.string.isRequired,
  isModal: PropTypes.bool.isRequired,

  // Redux State
  isBackDisabled: PropTypes.bool.isRequired,
  activePath: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(FINDER.PATH_TYPE)).isRequired,
    state: PropTypes.object
  }).isRequired,
  activeNode: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parent: PropTypes.object.isRequired
  }).isRequired,
  selectedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  moveNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  isTemplateView: PropTypes.bool.isRequired,
  user: UserPropTypes.isRequired,

  // Redux Actions
  goBackFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired,
  updateFinderSearchText: PropTypes.func.isRequired,
  openFinderModal: PropTypes.func.isRequired,
  startMoveFinderNodes: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired,
  toggleCards: PropTypes.func.isRequired,
  toggleTemplateView: PropTypes.func.isRequired,
  updateCreatePath: PropTypes.func.isRequired
};

export default FinderHeader;
