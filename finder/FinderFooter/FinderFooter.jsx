import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import { NodePropTypes } from 'utils/propTypes';
import { FINDER_TYPE } from 'appConstants/finder';

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

  const isDisabled = (destination) => {
    switch (typeof isPrimaryDisabled) {
      case 'boolean':
        return isPrimaryDisabled;
      case 'function':
        return isPrimaryDisabled(destination);
      default:
        return false;
    }
  };

  const render = () => {
    if (!isModal) {
      return null;
    }

    const destination = getDestinationNode();
    const disabled = isDisabled(destination);

    return (
      <div
        className={s('px-lg py-sm flex items-center justify-end border-0 border-t finder-border')}
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
  isPrimaryDisabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  // Redux State
  activeNode: NodePropTypes.isRequired,
  selectedNodes: PropTypes.arrayOf(NodePropTypes).isRequired
};

export default FinderFooter;
