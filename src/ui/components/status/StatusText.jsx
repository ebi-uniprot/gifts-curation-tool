import React from 'react';
import PropTypes from 'prop-types';

import { formatStatusName } from '../../util/util';

import '../../../styles/StatusText.scss';

const StatusText = ({
  value,
  labels,
}) => (
  <div className="status-text">
    {formatStatusName(value, labels)}
  </div>
);

StatusText.propTypes = {
  value: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
    formatted: PropTypes.string,
  })).isRequired,
};

export default StatusText;
