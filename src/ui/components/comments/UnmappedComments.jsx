import React, { Fragment } from "react";
import PropTypes from "prop-types";

import CommentsSection from "./CommentsSection";
import StatusChangeControl from "../status/StatusChangeControl";
import CommentsAndStatusModal from "./CommentsAndStatusModal";

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

  const commentsApiUri = `${process.env.REACT_APP_API_URL}/unmapped/${id}/comments/`;
  const statusApiUri = `${process.env.REACT_APP_API_URL}/unmapped/${id}/status/`;

  const statusChangeControl = (
    <StatusChangeControl
      status={mappingStatus}
      onChange={onMappingStatusChange}
    />
  );

  return (
    <Fragment>
      <CommentsSection isLoggedIn={isLoggedIn} comments={comments} />

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

UnmappedComments.propTypes = {
  id: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  mappingStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onMappingStatusChange: PropTypes.func.isRequired,
  afterSaveCallback: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})),
  originalMappingStatus: PropTypes.string.isRequired,
  notificationsList: PropTypes.shape({}),
};

UnmappedComments.defaultProps = {
  comments: [],
  notificationsList: {},
};

export default UnmappedComments;
