import React from 'react';
import PropTypes from 'prop-types';

import StatusSection from './StatusSection';

const UnmappedStatusControl = (props) => {
  const { id } = props;
  const apiUri = `${API_URL}/unmapped/${id}/status/`;

  return (
    <StatusSection
      id={id}
      apiUri={apiUri}
      {...props}
    />
  );
};

UnmappedStatusControl.propTypes = {
  id: PropTypes.number.isRequired,
};

export default UnmappedStatusControl;
