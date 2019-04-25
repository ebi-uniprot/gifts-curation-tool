import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import MappingStatusControl from '../MappingStatusControl';

class MappingComments extends Component {
  render() {
    const {
      id,
      isLoggedIn,
      comments,
      mappingStatus,
      onMappingStatusChange,
      statusChangeControl,
      afterSaveCallback,
    } = this.props;

    const apiUri = `${API_URL}/mapping/${id}/comments/`;

    const mappingStatusControl = <MappingStatusControl 
      id={id}
      isLoggedIn={isLoggedIn}
      status={mappingStatus}
      onChange={onMappingStatusChange}
      editable={true}
    />;
console.log("-- mapping status:", mappingStatus);
    return <CommentsSection
      id={id}
      isLoggedIn={isLoggedIn}
      comments={comments}
      mappingStatus={status}
      afterSaveCallback={afterSaveCallback}
      mapped={true}
      statusChangeControl={mappingStatusControl}
      apiUri={apiUri}
    />;
  }
};

export default MappingComments;
