import React from 'react';
import { MdCheck } from 'react-icons/md';
import { getStyleApplicationFn } from '../../utils/styleHelpers';

import style from './card.css';
const s = getStyleApplicationFn(style);

export const Card = ({
  heading,
  description,
  datePosted,
  status,
  onHover = null,
  onMouseLeave = null
}) => (
  <div
    onMouseOver={onHover}
    onMouseOut={onMouseLeave}
    className={s('Card m-1 my-2 rounded-xl p-4 bg-white text-gray-800')}
  >
    <div className={s('Card__header flex flex-col')}>
      <span className={s('Card__heading text-lg capitalize text-left')}>
        {heading}
      </span>
      <span className={s('Card__description mt-2 text-sm')}>
        {description}
      </span>
    </div>
    <div
      className={s(
          'Card__footer border-t mt-2 flex flex-row justify-between '
        )}
    >
      <span className="block text-center mt-5 text-sm text-gray-500">
        {datePosted}
      </span>
      <div
        className={s(
            'rounded-full bg-green-200 text-green-500 mt-5 py-1 px-2 w-1/2 flex flex-row'
          )}
      >
        {/** this will vary based on status */}
        <MdCheck className={s('mr-xs')} />
          Up to date
        </div>
    </div>
  </div>
  );
