import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import '../../styles/SendNotificationUI.scss';

const SendNotificationUI = ({
  options,
  selectedOption,
  onChange,
}) => {
  const optionsArray = Object.keys(options)
    .map(key => ({ value: key, label: options[key] }));

  return (
    <div className="send-notification-ui-wrapper">
      <Select
        value={selectedOption}
        onChange={selection => onChange(selection)}
        options={optionsArray}
        isMulti
        className="react-select-wrapper"
        classNamePrefix="react-select"
        placeholder="Select team(s)"
      />
    </div>
  );
};

SendNotificationUI.propTypes = {
  options: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  selectedOption: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SendNotificationUI;
