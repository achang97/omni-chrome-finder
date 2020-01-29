import React, { Component } from 'react';
import Button from '../../common/Button';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const SuggestionPreview = ({ heading, headingDescription, description, datePosted, isUpToDate }) => {
  return (
    <div className={s("w-full flex flex-col rounded-lg shadow-xl border-gray-200 border border-solid")}>
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
      <Button
        text="View full card"
        underline={true}
        buttonClassName={s("rounded-t-0")}
      />
    </div>
  );
}

export default SuggestionPreview;