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
      className={s('Card m-sm my-reg rounded-xl p-reg bg-white text-gray-800')}
    >
      <div className={s('Card__header flex flex-col')}>
        <span className={s('Card__heading text-lg capitalize text-left text-black font-semibold')}>
          {heading}
        </span>
        <span className={s('Card__description mt-sm text-sm')}>
          {description}
        </span>
      </div>
      <div
        className={s(
          'Card__footer w-full border-t border-gray-300 mt-sm flex flex-row justify-between items-center'
        )}
      >
        <span className={s("block text-center mt-xl text-sm text-gray-500")}>
          {datePosted}
        </span>
        <div
          className={s(
            'rounded-full bg-green-200 text-green-600 shadow-md mt-xl py-sm px-reg flex flex-row text-right self-end text-sm font-bold '
          )}
        >
          {/** this will vary based on status */}
          <MdCheck className={s('mr-xs text-lg')} />
          Up to date
        </div>
      </div>
    </div>
  );
