import React from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import MappingStatusControl from '../MappingStatusControl';

const MappingComments = (props) => {
  const {
    id,
    isLoggedIn,
    comments,
    mappingStatus,
    onMappingStatusChange,
    afterSaveCallback,
  } = props;

  const apiUri = `${API_URL}/mapping/${id}/comments/`;

  const mappingStatusControl = (
    <MappingStatusControl
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
      mapped={true}
      statusChangeControl={mappingStatusControl}
      apiUri={apiUri}
    />
  );
};

MappingComments.propTypes = {
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

MappingComments.defaultProps = {
  comments: [],
};

export default MappingComments;
