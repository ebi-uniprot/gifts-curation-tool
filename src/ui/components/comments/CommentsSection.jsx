import React from 'react';
import PropTypes from 'prop-types';

import Comment from './Comment';

import '../../../styles/CommentsSection.scss';

const CommentsSection = ({
  isLoggedIn,
  comments,
}) => {
  if (!isLoggedIn) {
    return false;
  }

  return (
    <div className="comments-section">
      <div className="row">
        {comments.map(comment => (
          <Comment
            details={comment}
            key={`${comment.user}-${comment.timeAdded}-${Math.random()}`}
          />
        ))}

      </div>
    </div>
  );
};

CommentsSection.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})),
};

CommentsSection.defaultProps = {
  comments: [],
};

export default CommentsSection;
