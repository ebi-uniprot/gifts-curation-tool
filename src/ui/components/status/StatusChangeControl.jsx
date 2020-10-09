import React from 'react';
import PropTypes from 'prop-types';

import { statusesList } from '../../util/util';

import '../../../styles/StatusChangeControl.scss';

const StatusChangeControl = ({
  status,
  onChange,
}) => (
  <div className="status-change-form">
    <select
      className="status-modifier input-group-field"
      onChange={onChange}
      value={status}
    >
      {statusesList.map(option => (
        <option value={option.description} key={`status_${option.id}`}>
          {option.formatted}
        </option>
      ))}
    </select>
  </div>
);

StatusChangeControl.propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StatusChangeControl;
