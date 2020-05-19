import React from 'react';
import PropTypes from 'prop-types';
import ReactDraggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { Transition } from 'react-transition-group';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdClose } from 'react-icons/md';
import { FiMinus, FiPlus } from 'react-icons/fi';

import { CardView } from 'components/cards';
import { FinderView } from 'components/finder';
import { Tabs, Tab, ConfirmModal } from 'components/common';

import { cardStateChanged, getNewCardBaseState, getDraggableStyle } from 'utils/card';
import { getBaseAnimationStyle } from 'utils/animate';
import { UserPropTypes } from 'utils/propTypes';

import FinderFolder from 'assets/images/finder/folder.svg';

import { colors } from 'styles/colors';
import { CARD, FINDER } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import style from './cards.css';

const s = getStyleApplicationFn(style);

const CARDS_TRANSITION_MS = 300;

const Cards = ({
  user,
  cards,
  showCards,
  cardsExpanded,
  activeCardIndex,
  activeCard,
  cardsWidth,
  cardsHeight,
  windowPosition,
  showCloseModal,
  openCard,
  openFinder,
  closeCard,
  closeAllCards,
  setActiveCardIndex,
  updateCardWindowPosition,
  adjustCardsDimensions,
  updateCardTabOrder,
  openCardModal,
  openCardContainerModal,
  closeCardContainerModal,
  toggleCards
}) => {
  const getCurrentCard = (index) => {
    // Get updated current card
    let currentCard = cards[index];
    if (index === activeCardIndex) {
      currentCard = activeCard;
    }

    return currentCard;
  };

  const updateTab = (tabValue) => {
    if (tabValue !== activeCardIndex) setActiveCardIndex(tabValue);
  };

  const handleCloseClick = (e, index) => {
    e.stopPropagation();

    const currentCard = getCurrentCard(index);

    // Check to make sure edit state is different than saved state
    if (cardStateChanged(currentCard)) {
      if (index !== activeCardIndex) {
        updateTab(index);
      }

      if (currentCard.status === CARD.STATUS.NOT_DOCUMENTED) {
        openCardModal(CARD.MODAL_TYPE.CONFIRM_CLOSE_UNDOCUMENTED);
      } else {
        openCardModal(CARD.MODAL_TYPE.CONFIRM_CLOSE);
      }
    } else {
      closeCard(index);
    }
  };

  const handleCloseAllCards = () => {
    const cardChanges = cards.some((card, i) => {
      return cardStateChanged(getCurrentCard(i));
    });

    if (cardChanges) {
      openCardContainerModal();
    } else {
      closeAllCards();
    }
  };

  const isFinderShown = () => {
    return activeCardIndex === FINDER.TAB_INDEX;
  };

  const renderCloseModal = () => {
    return (
      <ConfirmModal
        isOpen={showCloseModal}
        onRequestClose={closeCardContainerModal}
        title="Close Cards"
        description="One of more of the cards open have unsaved changes. All unsaved changes will be lost upon closing the cards. Are you sure you want to close your cards?"
        primaryButtonProps={{
          text: 'Close Cards',
          onClick: closeAllCards
        }}
        secondaryButtonProps={{
          text: 'No',
          onClick: closeCardContainerModal
        }}
        overlayClassName={s('rounded-lg')}
      />
    );
  };

  const renderTabHeaderButtons = () => {
    let buttons = [
      {
        key: 'close',
        Icon: MdClose,
        onClick: handleCloseAllCards
      },
      {
        key: 'toggle',
        Icon: cardsExpanded ? FiMinus : FiPlus,
        onClick: toggleCards
      }
    ];

    if (!cardsExpanded) {
      buttons = buttons.reverse();
    }

    return (
      <div
        className={s('flex flex-shrink-0 text-sm text-purple-gray-50 mx-sm')}
        onClick={(e) => e.stopPropagation()}
      >
        {buttons.map(({ Icon, onClick, key }, i) => (
          <button
            key={key}
            onClick={onClick}
            type="button"
            className={s(i !== buttons.length - 1 ? 'mr-xs' : '')}
          >
            <Icon />
          </button>
        ))}
      </div>
    );
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    updateCardTabOrder(result.source, result.destination);
  };

  const renderTab = (card, i) => {
    const dragDisabled = cards.length <= 1;

    const isActiveCard = i === activeCardIndex;
    const currCard = isActiveCard ? activeCard : card;
    const { isEditing, question, edits, _id } = currCard;

    return (
      <Tab key={_id} tabClassName={s('p-0 border-0')} value={i}>
        <Draggable key={_id} draggableId={_id} index={i} isDragDisabled={dragDisabled}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getDraggableStyle(
                snapshot.isDragging,
                provided.draggableProps.style,
                windowPosition
              )}
              className={s(
                `card-tab card-header-tab ${!dragDisabled ? 'card-disable-window-drag' : ''}`
              )}
            >
              <div className={s('truncate flex-1')}>
                {(!isEditing ? question : edits.question) || 'Untitled'}
              </div>
              <div onClick={(e) => handleCloseClick(e, i)} className={s('cursor-pointer')}>
                <MdClose color={colors.purple['gray-50']} />
              </div>
            </div>
          )}
        </Draggable>
      </Tab>
    );
  };

  const renderFinderTab = () => {
    const isActiveTab = isFinderShown();
    return (
      <div
        className={s(`card-tab button-hover ${!isActiveTab ? 'card-inactive-tab' : ''}`)}
        onClick={openFinder}
      >
        <img src={FinderFolder} className={s('h-reg mr-xs')} alt="Finder" />
        <div> Finder </div>
      </div>
    );
  };

  const renderTabHeader = () => {
    return (
      <div
        id="card-tab-container"
        className={s('card-tab-container')}
        style={{ height: CARD.DIMENSIONS.TABS_HEIGHT }}
      >
        {renderTabHeaderButtons()}
        {renderFinderTab()}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={s('flex items-center flex-1 min-w-0 max-h-full')}
              >
                <Tabs
                  activeValue={activeCardIndex}
                  showRipple={false}
                  inactiveTabClassName={s('card-inactive-tab')}
                  scrollButtonColor={colors.purple['gray-50']}
                  clickOnMouseDown
                  onTabClick={updateTab}
                  className={s(`
                    ${snapshot.draggingFromThisWith ? 'flex-1 min-w-full max-w-full' : ''}`)}
                >
                  {cards.map(renderTab)}
                </Tabs>
                {!snapshot.draggingFromThisWith && (
                  <button
                    onClick={() => openCard(getNewCardBaseState(user), true)}
                    className={s('mx-xs text-purple-gray-50')}
                    type="button"
                  >
                    <FiPlus />
                  </button>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  };

  const onResizeStop = (e, direction, ref) => {
    adjustCardsDimensions(ref.clientWidth, ref.clientHeight);
  };

  const renderExpandedCards = () => {
    const baseStyle = getBaseAnimationStyle(CARDS_TRANSITION_MS);

    const translateX = `${-(windowPosition.x + cardsWidth)}px`;
    const translateY = `calc(100vh - ${windowPosition.y}px)`;
    const transform = `translate(${translateX}, ${translateY})`;

    const transitionStyles = {
      entering: { transform },
      entered: {},
      exiting: { transform },
      exited: { transform }
    };

    return (
      <Transition in={cardsExpanded} timeout={CARDS_TRANSITION_MS} mountOnEnter unmountOnExit>
        {(state) => (
          <div style={{ ...baseStyle, ...transitionStyles[state] }} className={s('card')}>
            <ReactDraggable
              bounds="html"
              handle="#card-tab-container"
              cancel={`.${s('card-disable-window-drag')}`}
              onStop={(e, { x, y }) => updateCardWindowPosition({ x, y })}
              defaultPosition={windowPosition}
            >
              <Resizable
                className={s('card bg-white rounded-lg shadow-2xl flex flex-col')}
                size={{ width: cardsWidth, height: cardsHeight }}
                onResizeStop={onResizeStop}
                minWidth={CARD.DIMENSIONS.DEFAULT_CARDS_WIDTH}
                minHeight={CARD.DIMENSIONS.DEFAULT_CARDS_HEIGHT}
                enable={{
                  top: false,
                  right: true,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: true,
                  bottomLeft: false,
                  topLeft: false
                }}
              >
                {renderTabHeader()}
                {isFinderShown() ? <FinderView finderId={FINDER.MAIN_STATE_ID} /> : <CardView />}
                {renderCloseModal()}
              </Resizable>
            </ReactDraggable>
          </div>
        )}
      </Transition>
    );
  };

  const renderMinimizedCards = () => {
    const { question, edits, isEditing } = activeCard || {};
    const activeCardLabel = !isEditing ? question : edits.question;

    const label = isFinderShown() ? 'Finder' : activeCardLabel;
    const numCards = cards.length;

    return (
      <div className={s('card-tab card-minimized-tab')} onClick={toggleCards}>
        <div className={s('font-semibold truncate')}>{label || 'Untitled'}</div>
        {numCards > 1 && (
          <div
            className={s('bg-purple-gray-50 text-white font-semibold rounded-full px-xs ml-auto')}
          >
            {cards.length}
          </div>
        )}
        <div className={s('px-xs')}>{renderTabHeaderButtons()}</div>
      </div>
    );
  };

  if (!showCards) {
    return null;
  }

  return (
    <>
      {renderExpandedCards()}
      {!cardsExpanded && renderMinimizedCards()}
    </>
  );
};

Cards.propTypes = {
  user: UserPropTypes.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCards: PropTypes.bool.isRequired,
  cardsExpanded: PropTypes.bool.isRequired,
  activeCardIndex: PropTypes.number.isRequired,
  activeCard: PropTypes.shape({
    question: PropTypes.string,
    edits: PropTypes.object,
    isEditing: PropTypes.bool
  }),
  cardsWidth: PropTypes.number.isRequired,
  cardsHeight: PropTypes.number.isRequired,
  windowPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  showCloseModal: PropTypes.bool.isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired,
  openFinder: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
  closeAllCards: PropTypes.func.isRequired,
  setActiveCardIndex: PropTypes.func.isRequired,
  updateCardWindowPosition: PropTypes.func.isRequired,
  adjustCardsDimensions: PropTypes.func.isRequired,
  updateCardTabOrder: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  openCardContainerModal: PropTypes.func.isRequired,
  closeCardContainerModal: PropTypes.func.isRequired,
  toggleCards: PropTypes.func.isRequired
};

export default Cards;
