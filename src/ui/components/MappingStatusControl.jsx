import React, { Component } from 'react';

import StatusSection from './StatusSection';

class MappingStatusControl extends Component {
  render() {
    const {
      id,
    } = this.props;

    const apiUri = `${API_URL}/mapping/${id}/status/`;

    return <StatusSection
      id={id}
      apiUri={apiUri}
      {...this.props}
    />;
  };
}

export default MappingStatusControl;