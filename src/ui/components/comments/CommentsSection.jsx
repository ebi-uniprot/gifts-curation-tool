import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import SimpleMED from 'simplemde';

import Comment from './Comment';

import '../../../styles/CommentsSection.scss';

class CommentsSection extends Component {
  state = {};

  textEditor = null;

  componentDidMount() {
    const { isLoggedIn } = this.props;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }
  }

  componentDidUpdate() {
    const { isLoggedIn, id } = this.props;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }

    // fix this re-render issue later
    if (this.textEditor) {
      this.textEditor.render(document.getElementById('text-editor'));

      this.textEditor.value(
        localStorage.getItem(
          this.createId(id),
        )
      || '',
      );
    }
  }

  createTextEditor = () => {
    const { id } = this.props;
    const element = document.getElementById('text-editor');

    if (element === null) {
      return;
    }

    this.textEditor = new SimpleMED({
      element,
      initialValue: localStorage.getItem(this.createId(id)) || '',
      hideIcons: ['image'],
    });

    this.textEditor.codemirror.on('change', this.onCommentTextchange);
  };

  onCommentTextchange = () => {
    const { id } = this.props;
    const text = this.textEditor.value();

    localStorage.setItem(this.createId(id), text);
  }

  saveComment = () => {
    const {
      id,
      isLoggedIn,
      history,
      cookies,
      afterSaveCallback,
      apiUri,
    } = this.props;

    const comment = {
      text: this.textEditor.value(),
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios
      .post(apiUri, comment, config)
      .then(() => {
        this.textEditor.value('');
        afterSaveCallback(id, isLoggedIn);

        localStorage.removeItem(this.createId(id));
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  createId(id) {
    const { mapped } = this.props;

    return `comments-${(mapped) ? 'mapped' : 'unmapped'}-${id}`;
  }

  render() {
    const {
      isLoggedIn,
      comments,
      statusChangeControl,
    } = this.props;

    if (isLoggedIn === false) {
      return null;
    }

    return (
      <div className="comments-section">
        {comments.map(comment => (
          <Comment
            details={comment}
            key={`${comment.user}-${comment.timeAdded}-${Math.random()}`}
          />
        ))}

        <div className="comment row">
          <div className="column medium-12">
            <div className="comment__avatar">?</div>
            <div className="comment__details">
              <div className="status-wrapper">
                {statusChangeControl}
              </div>
              <textarea id="text-editor" />
              <button
                className="comments-section__save-button button"
                onClick={this.saveComment}
                type="button"
              >
                Add comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CommentsSection.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  history: PropTypes.shape({}).isRequired,
  cookies: PropTypes.shape({}).isRequired,
  afterSaveCallback: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})),
  mapped: PropTypes.bool.isRequired,
  statusChangeControl: PropTypes.node.isRequired,
  apiUri: PropTypes.string.isRequired,
};

CommentsSection.defaultProps = {
  comments: [],
};

export default withRouter(withCookies(CommentsSection));
