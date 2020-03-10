import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../common/Button';

import { getContentStateHTMLFromString } from '../../../utils/editor';

import style from './suggestion-preview.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCard } from '../../../actions/cards';

const SuggestionPreview = ({ _id, question, questionDescription, answer, openCard }) => {
  return (
    <div className={s("suggestion-preview")}>
      <div className={s("bg-purple-light py-xl px-lg rounded-t-lg")}>
        <div className={s("text-lg font-semibold")}>
          { question }
        </div>
        { questionDescription &&
          <div className={s("mt-reg text-xs text-gray-dark font-medium")}>
            {questionDescription}
          </div>
        }
      </div>
      <div className={s("bg-white py-xl px-lg text-sm")}>
        {answer}
      </div>
      <div className={s("bg-white rounded-b-lg")} onClick={() => openCard({ _id })}>
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

SuggestionPreview.propTypes = {
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  questionDescription: PropTypes.string,
  answer: PropTypes.string.isRequired,
}

export default connect(
  state => ({
  }),
  dispatch => bindActionCreators({
    openCard,
  }, dispatch)
)(SuggestionPreview);