import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import StatusChangeControl from '../status/StatusChangeControl';
import UnmappedStatusControl from '../UnmappedStatusControl';

const UnmappedComments = (props) => {
  const {
    id,
    isLoggedIn,
    comments,
    mappingStatus,
    originalMappingStatus,
    onMappingStatusChange,
    afterSaveCallback,
    notificationsList,
  } = props;

  const apiUri = `${API_URL}/unmapped/${id}/comments/`;

  const statusChangeControl = (
    <StatusChangeControl
      status={mappingStatus}
      onChange={onMappingStatusChange}
    />
  );

  return (
    <CommentsSection
      isLoggedIn={isLoggedIn}
      comments={comments}
    />
  );
};

UnmappedComments.propTypes = {
  id: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  mappingStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onMappingStatusChange: PropTypes.func.isRequired,
  afterSaveCallback: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})),
};

UnmappedComments.defaultProps = {
  comments: [],
};

export default UnmappedComments;
