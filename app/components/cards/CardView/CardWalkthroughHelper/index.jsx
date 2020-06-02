import React from 'react';
import PropTypes from 'prop-types';
import { Button, Triangle, Separator } from 'components/common';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import style from './walkthrough-helper.css';

const s = getStyleApplicationFn(style);

const WIDTH = 300;
const MARGIN = 25;

const WalkthroughHelper = React.forwardRef(
  ({ title, subtitle, onPrevClick, onNextClick, margin }, ref) => {
    const { height } = ref ? ref.getBoundingClientRect() : {};

    if (!height) {
      return null;
    }

    return (
      <div
        className={s('walkthrough-helper')}
        style={{
          bottom: ref.offsetParent.offsetHeight - ref.offsetTop - height,
          left: -WIDTH - MARGIN - margin,
          width: WIDTH
        }}
      >
        <div className={s('font-semibold mb-reg')}> {title} </div>
        <div> {subtitle} </div>
        <Separator horizontal className={s('my-reg')} />
        <div className={s('flex justify-between')}>
          <div className={s('flex-1')}>
            {onPrevClick && (
              <div onClick={onPrevClick} className={s('text-xs mt-sm cursor-pointer')}>
                Previous
              </div>
            )}
          </div>
          <div className={s('flex-1 flex justify-end')}>
            {onNextClick && (
              <Button
                text="Continue"
                color="primary"
                onClick={onNextClick}
                className={s('p-sm py-xs self-start')}
                textClassName={s('text-md')}
              />
            )}
          </div>
        </div>
        <Triangle
          direction="right"
          size={10}
          outlineSize={3}
          color="white"
          outlineColor={colors.purple['gray-10']}
          className={s('walkthrough-helper-triangle')}
        />
      </div>
    );
  }
);

WalkthroughHelper.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func,
  margin: PropTypes.number
};

WalkthroughHelper.defaultProps = {
  margin: 0
};

WalkthroughHelper.displayName = 'WalkthroughHelper';

export default WalkthroughHelper;
