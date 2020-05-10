import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'components/common';
import { VERIFICATION_INTERVAL_OPTIONS } from 'appConstants/card';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardVerificationInterval = ({ isEditable, verificationInterval, onChange }) =>
  isEditable ? (
    <Select
      value={verificationInterval}
      onChange={onChange}
      options={VERIFICATION_INTERVAL_OPTIONS}
      placeholder="Select verification interval..."
      isSearchable
      menuShouldScrollIntoView
    />
  ) : (
    <div
      className={s(
        'underline-border border-purple-gray-20 mb-sm text-purple-reg text-sm inline-block'
      )}
    >
      {verificationInterval.label}
    </div>
  );

CardVerificationInterval.propTypes = {
  isEditable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  verificationInterval: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })
};

CardVerificationInterval.defaultProps = {
  isEditable: false,
  verificationInterval: null
};

export default CardVerificationInterval;
