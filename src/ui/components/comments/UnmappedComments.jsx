import React from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import UnmappedStatusControl from '../UnmappedStatusControl';

const UnmappedComments = (props) => {
  const {
    id,
    isLoggedIn,
    comments,
    mappingStatus,
    onMappingStatusChange,
    afterSaveCallback,
  } = props;

  const apiUri = `${API_URL}/unmapped/${id}/comments/`;

  const unmappedStatusControl = (
    <UnmappedStatusControl
      id={id}
      isLoggedIn={isLoggedIn}
      status={mappingStatus}
      onChange={onMappingStatusChange}
      editable={true}
    />
  );

  return (
    <CommentsSection
      id={id}
      isLoggedIn={isLoggedIn}
      comments={comments}
      mappingStatus={mappingStatus}
      afterSaveCallback={afterSaveCallback}
      mapped={false}
      statusChangeControl={unmappedStatusControl}
      apiUri={apiUri}
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
