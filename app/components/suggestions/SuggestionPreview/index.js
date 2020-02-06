import React, { Component } from 'react';
import Button from '../../common/Button';

import style from './suggestion-preview.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SuggestionPreview = ({ heading, headingDescription, description, datePosted, isUpToDate }) => {
  return (
    <div className={s("suggestion-preview")}>
      <div className={s("bg-purple-light py-xl px-lg rounded-t-lg")}>
        <div className={s("text-lg font-semibold")}>
          { heading }
        </div>
        <div className={s("mt-reg text-xs text-gray-dark font-medium")}>
          { headingDescription }
        </div>
      </div>
      <div className={s("bg-white py-xl px-lg text-sm")}>
        { description }
      </div>
      <div className={s("bg-white rounded-b-lg")}>
        <Button
          text="View full card"
          underline={true}
          color="transparent"
          className={s("rounded-t-none")}
        />
      </div>
    </div>
  );
}

export default SuggestionPreview;