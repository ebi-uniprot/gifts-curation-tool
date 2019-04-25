import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import UnmappedStatusControl from '../UnmappedStatusControl';

class UnmappedComments extends Component {
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

    const apiUri = `${API_URL}/unmapped/${id}/comments/`;

    const unmappedStatusControl = <UnmappedStatusControl 
      id={id}
      isLoggedIn={isLoggedIn}
      status={mappingStatus}
      onChange={onMappingStatusChange}
      editable={true}
    />;
console.log(">> unmapped status:", mappingStatus);
    return <CommentsSection
      id={id}
      isLoggedIn={isLoggedIn}
      comments={comments}
      mappingStatus={status}
      afterSaveCallback={afterSaveCallback}
      mapped={false}
      statusChangeControl={unmappedStatusControl}
      apiUri={apiUri}
    />;
  }
};

export default UnmappedComments;
