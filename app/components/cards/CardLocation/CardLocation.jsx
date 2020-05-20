import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/md';

import { FINDER, CARD } from 'appConstants';
import { getFullPath } from 'utils/finder';
import { getStyleApplicationFn } from 'utils/style';
import MoveFolder from 'assets/images/finder/move-folder.svg';

import style from './card-location.css';

const s = getStyleApplicationFn(style);

const CardLocation = ({
  finderNode,
  isEditable,
  className,
  openCardModal,
  closeCardModal,
  openFinder,
  pushFinderNode
}) => {
  const onChangeClick = () => {
    closeCardModal(CARD.MODAL_TYPE.CREATE);
    openCardModal(CARD.MODAL_TYPE.FINDER);
  };

  const onNodeClick = (nodeId) => {
    openFinder();
    pushFinderNode(FINDER.MAIN_STATE_ID, nodeId);
  };

  const fullPath = getFullPath(finderNode);

  return (
    <div className={s(`flex items-start text-purple-reg ${className}`)}>
      <div className={s('flex-1 flex flex-wrap items-center text-sm')}>
        <span className={s('card-location-node-name')} onClick={() => onNodeClick(FINDER.ROOT.ID)}>
          {FINDER.ROOT.NAME}
        </span>
        {fullPath &&
          fullPath.map(({ _id, name }) => (
            <React.Fragment key={_id}>
              <MdChevronRight className={s('m-xs')} />
              <span className={s('card-location-node-name')} onClick={() => onNodeClick(_id)}>
                {name}
              </span>
            </React.Fragment>
          ))}
      </div>
      {isEditable && (
        <div className={s('flex items-center cursor-pointer text-xs')} onClick={onChangeClick}>
          <span>Change</span>
          <img src={MoveFolder} className={s('h-lg w-lg ml-xs')} alt="Move Location" />
        </div>
      )}
    </div>
  );
};

CardLocation.propTypes = {
  isEditable: PropTypes.bool,
  finderNode: PropTypes.shape({
    path: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    _id: PropTypes.string,
    name: PropTypes.string
  }),
  className: PropTypes.string,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  openFinder: PropTypes.func.isRequired,
  pushFinderNode: PropTypes.func.isRequired
};

CardLocation.defaultProps = {
  isEditable: false,
  className: ''
};

export default CardLocation;
