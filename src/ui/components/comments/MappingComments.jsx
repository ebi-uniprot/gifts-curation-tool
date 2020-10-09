import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import CommentsSection from './CommentsSection';
import StatusChangeControl from '../status/StatusChangeControl';
import CommentsAndStatusModal from './CommentsAndStatusModal';

const MappingComments = (props) => {
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

  const statusChangeControl = (
    <StatusChangeControl
      status={mappingStatus}
      onChange={onMappingStatusChange}
    />
  );

  const commentsApiUri = `${API_URL}/mapping/${id}/comments/`;
  const statusApiUri = `${API_URL}/mapping/${id}/status/`;

  return (
    <Fragment>
      <CommentsSection
        isLoggedIn={isLoggedIn}
        comments={comments}
      />

      <CommentsAndStatusModal
        id={id}
        isLoggedIn={isLoggedIn}
        mappingStatus={mappingStatus}
        originalMappingStatus={originalMappingStatus}
        afterSaveCallback={afterSaveCallback}
        statusChangeControl={statusChangeControl}
        notificationsList={notificationsList}
        commentsApiUri={commentsApiUri}
        statusApiUri={statusApiUri}
        mapped
      />
    </Fragment>
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
  notificationsList: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  originalMappingStatus: PropTypes.string.isRequired,
};

MappingComments.defaultProps = {
  comments: [],
};

export default MappingComments;
