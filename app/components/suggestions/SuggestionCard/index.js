import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck } from 'react-icons/md';

import CardStatus from '../../cards/CardStatus';
import SuggestionPreview from '../SuggestionPreview';
import Button from '../../common/Button';
import Triangle from '../../common/Triangle';

import _ from 'underscore';

import { colors } from '../../../styles/colors';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

class SuggestionCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { heading, headingDescription, description, datePosted, cardStatus } = this.props;
    return (
      <div className={s("mx-sm mb-sm rounded-xl p-lg bg-white")} >
        <div className={s("flex flex-col")}>
          <span className={s("text-lg text-left font-semibold")}>
            {heading}
          </span>
          <span className={s("mt-sm text-xs text-gray-dark font-medium vertical-ellipsis-2")}>
            {description}
          </span>
        </div>
        <div className={s("mt-reg pt-reg flex-col")}>
          <div className={s("horizontal-separator mb-sm")} />
          <div className={s("flex items-center justify-between")}>
            <span className={s("block text-center text-xs text-gray-light")}>
              {datePosted}
            </span>
            <CardStatus cardStatus={cardStatus} />
          </div>
        </div>
      </div>
    );
  }
}

SuggestionCard.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  datePosted: PropTypes.string.isRequired,
  cardStatus: PropTypes.string.isRequired,
}

export default SuggestionCard;