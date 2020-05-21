import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { FINDER_TYPE } from 'appConstants/finder';
import { NOOP } from 'appConstants';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({
  isModal,
  onSecondaryClick,
  onPrimaryClick,
  isPrimaryDisabled,
  activeNode,
  selectedNodes
}) => {
  const getDestinationNode = () => {
    if (selectedNodes.length === 0 || selectedNodes.length > 1) {
      return activeNode;
    }

    const selectedNode = selectedNodes[0];
    if (selectedNode && selectedNode.finderType === FINDER_TYPE.NODE) {
      return selectedNode;
    }

    return activeNode;
  };

  const render = () => {
    if (!isModal) {
      return null;
    }

    const destination = getDestinationNode();
    const disabled = isPrimaryDisabled(destination);

    return (
      <div
        className={s('px-lg py-sm flex items-center justify-end border-t finder-border')}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s('flex-1 text-sm text-gray-dark truncate')}>
          <span> {disabled ? 'Cannot move selected item(s) to: ' : 'Move to:'} </span>
          <b> {destination.name} </b>
        </div>
        <Button text="Cancel" color="secondary" className={s('mr-sm')} onClick={onSecondaryClick} />
        <Button
          text="Choose"
          color="primary"
          onClick={() => onPrimaryClick(destination)}
          iconLeft={false}
          disabled={disabled}
        />
      </div>
    );
  };

  return render();
};

FinderFooter.propTypes = {
  finderId: PropTypes.string.isRequired,
  isModal: PropTypes.bool.isRequired,
  onSecondaryClick: PropTypes.func,
  onPrimaryClick: PropTypes.func,
  isPrimaryDisabled: PropTypes.func,

  // Redux State
  activeNode: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  selectedNodes: PropTypes.arrayOf(
    PropTypes.shape({
      finderType: PropTypes.oneOf(Object.values(FINDER_TYPE))
    })
  ).isRequired
};

FinderFooter.defaultProps = {
  isPrimaryDisabled: NOOP
};

export default FinderFooter;
