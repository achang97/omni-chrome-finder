import React, { Component } from 'react';
import Button from '../../common/Button';
import ReactHtmlParser from 'react-html-parser';

import { getContentStateHTMLFromString } from '../../../utils/editorHelpers';

import style from './suggestion-preview.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const SuggestionPreview = ({ question, questionDescription, answer }) => {
  return (
    <div className={s("suggestion-preview")}>
      <div className={s("bg-purple-light py-xl px-lg rounded-t-lg")}>
        <div className={s("text-lg font-semibold")}>
          { question }
        </div>
        <div className={s("mt-reg text-xs text-gray-dark font-medium")}>
          { ReactHtmlParser(getContentStateHTMLFromString(questionDescription)) }
        </div>
      </div>
      <div className={s("bg-white py-xl px-lg text-sm")}>
        { ReactHtmlParser(getContentStateHTMLFromString(answer)) }
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