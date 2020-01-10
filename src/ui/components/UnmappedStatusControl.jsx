import React from 'react';
import PropTypes from 'prop-types';

const UnmappedStatusControl = (props) => {
  const { id } = props;
  const apiUri = `${API_URL}/unmapped/${id}/status/`;

  return null;
};

UnmappedStatusControl.propTypes = {
  id: PropTypes.number.isRequired,
};

export default UnmappedStatusControl;
