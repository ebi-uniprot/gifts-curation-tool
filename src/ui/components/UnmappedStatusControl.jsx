import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StatusSection from './StatusSection';

class UnmappedStatusControl extends Component {
  render() {
    const {
      id,
    } = this.props;

    const apiUri = `${API_URL}/unmapped/${id}/status/`;

    return <StatusSection
      id={id}
      apiUri={apiUri}
      {...this.props}
    />;
  };
}

export default UnmappedStatusControl;
