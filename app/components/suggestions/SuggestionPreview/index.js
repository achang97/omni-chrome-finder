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

const SuggestionPreview = ({ id, question, questionDescription, answer, openCard }) => (
  <div className={s('suggestion-preview')}>
    <div className={s('bg-purple-light py-xl px-lg rounded-t-lg')}>
      <div className={s('text-lg font-semibold')}>
        <span> { question } </span>
      </div>
      { questionDescription &&
        <div className={s('mt-reg text-xs text-gray-dark font-medium')}>
          <span className={s('line-clamp-2 break-words')}> {questionDescription} </span>
        </div>
      }
    </div>
    <div className={s('bg-white py-xl px-lg text-sm')}>
      <span className={s('line-clamp-3 break-words')}>
        {answer}
      </span>
    </div>
    <div className={s('bg-white rounded-b-lg')} onClick={() => openCard({ _id: id })}>
      <Button
        text="View full card"
        underline
        color="transparent"
        className={s('rounded-t-none')}
      />
    </div>
  </div>
  );

SuggestionPreview.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  questionDescription: PropTypes.string,
  answer: PropTypes.string.isRequired,
};

export default connect(
  state => ({
  }),
  dispatch => bindActionCreators({
    openCard,
  }, dispatch)
)(SuggestionPreview);
