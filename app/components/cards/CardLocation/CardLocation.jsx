import React from 'react';
import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/md';

import { MODAL_TYPE } from 'appConstants/card';
import { getStyleApplicationFn } from 'utils/style';
import MoveFolder from 'assets/images/finder/move-folder.svg';

const s = getStyleApplicationFn();

const CardLocation = ({ path, isEditable, className, openCardModal, closeCardModal }) => {
  const onChangeClick = () => {
    closeCardModal(MODAL_TYPE.CREATE);
    openCardModal(MODAL_TYPE.FINDER);
  };

  return (
    <div className={s(`flex items-start text-purple-reg ${className}`)}>
      <div className={s('flex-1 flex flex-wrap items-center text-sm')}>
        <span className={s('font-bold')}>Home</span>
        {path.map(({ _id, name }) => (
          <React.Fragment key={_id}>
            <MdChevronRight className={s('m-xs')} />
            <span className={s('font-bold')}>{name}</span>
          </React.Fragment>
        ))}
      </div>
      {isEditable && (
        <div
          className={s('flex items-center cursor-pointer text-xs my-xs')}
          onClick={onChangeClick}
        >
          <span>Change</span>
          <img src={MoveFolder} className={s('h-lg w-lg ml-xs')} alt="Move Location" />
        </div>
      )}
    </div>
  );
};

CardLocation.propTypes = {
  isEditable: PropTypes.bool,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  className: PropTypes.string,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired
};

CardLocation.defaultProps = {
  isEditable: false,
  className: ''
};

export default CardLocation;
