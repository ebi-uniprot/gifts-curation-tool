import React from 'react';
import PropTypes from 'prop-types';

import StatusSection from './StatusSection';

const MappingStatusControl = (props) => {
  const { id } = props;
  const apiUri = `${API_URL}/mapping/${id}/status/`;

  return (
    <StatusSection
      id={id}
      apiUri={apiUri}
      {...props}
    />
  );
};

MappingStatusControl.propTypes = {
  id: PropTypes.number.isRequired,
};

export default MappingStatusControl;
