import React from 'react';
import { Button } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import finderStyle from '../finder.css';

const s = getStyleApplicationFn(finderStyle);

const FinderFooter = ({}) => {
  return (
    <div className={s('px-lg py-sm flex justify-end border-t finder-border')}>
      <Button text="Cancel" color="secondary" className={s('mr-sm')} />
      <Button text="Choose" color="primary" />
    </div>
  );
};

export default FinderFooter;
