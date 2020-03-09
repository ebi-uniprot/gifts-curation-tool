import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import SimpleMED from 'simplemde';
import {
  Window,
  WindowActionButton,
  ModalBackdrop,
  useModal,
} from 'franklin-sites';

import SendNotificationUI from '../SendNotificationUI';
import '../../../../node_modules/simplemde/dist/simplemde.min.css';
import '../../../styles/CommentsAndStatusModal.scss';

const createId = (id, mapped) => `comments-${(mapped) ? 'mapped' : 'unmapped'}-${id}`;

const onCommentTextChange = (id, textEditor) => {
  const text = textEditor.value();

  localStorage.setItem(createId(id), text);
};

const createTextEditor = (
  id,
) => {
  const element = document.getElementById('text-editor');

  if (element === null) {
    return null;
  }

  const textEditor = new SimpleMED({
    element,
    initialValue: localStorage.getItem(createId(id)) || '',
    hideIcons: ['image'],
  });

  textEditor.codemirror.on('change', () => onCommentTextChange(id, textEditor));

  return textEditor;
};

/* eslint-disable consistent-return */
const saveComment = (
  id,
  textEditor,
  notificationLists,
  userToken,
  onSuccess,
  onFailure,
  apiUri,
) => {
  const notificationListsIds = notificationLists
    .map(l => parseInt(l.value, 10));

  const comment = {
    email_recipient_ids: notificationListsIds,
    text: textEditor.value(),
  };

  if (!comment.text || comment.text.length === 0) {
    return false;
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  };

  axios
    .post(apiUri, comment, config)
    .then(onSuccess)
    .catch(onFailure);
};

const updateStatus = (
  id,
  status,
  userToken,
  onSuccess,
  onFailure,
  apiUri,
) => {
  const changes = {
    status,
  };

  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  axios
    .put(apiUri, changes, config)
    .then(onSuccess)
    .catch(onFailure);
};

const CommentsAndStatusModal = ({
  id,
  isLoggedIn,
  statusChangeControl,
  cookies,
  afterSaveCallback,
  notificationsList,
  mappingStatus,
  originalMappingStatus,
  commentsApiUri,
  statusApiUri,
}) => {
  const [selectedNotificationsLists, setSelectedNotificatoinsLists] = useState([]);
  const userToken = cookies.get('userToken');

  let textEditor = null;

  useEffect(() => {
    if (textEditor === null) {
      textEditor = createTextEditor(id);
    }

    if (textEditor) {
      textEditor.render(document.getElementById('text-editor'));

      textEditor.value(
        localStorage.getItem(
          createId(id),
        )
      || '',
      );
    }
  });

  const modalWindowButtons = [
    <WindowActionButton
      text="Cancel"
      key="window-action-cancel"
      onClick={() => {
        setSelectedNotificatoinsLists([]);
        // eslint-disable-next-line no-use-before-define
        setDisplayModal(false);
      }}
    />,
    <WindowActionButton
      text="Submit"
      key="window-action-send"
      onClick={() => {
        const addCommentSuccess = () => {
          console.log('comment was added successfully.');
          textEditor.value('');
          setSelectedNotificatoinsLists([]);
          afterSaveCallback(id, isLoggedIn);
          localStorage.removeItem(createId(id));
        };
        const addCommentFail = (e) => {
          console.log('add comment was failed with an error:', e);
        };

        saveComment(
          id,
          textEditor,
          selectedNotificationsLists,
          userToken,
          addCommentSuccess,
          addCommentFail,
          commentsApiUri,
        );

        if (originalMappingStatus !== mappingStatus) {
          const statusUpdateSuccess = () => {
            console.log('status was updated successfully.');
          };
          const statusUpdateFail = (e) => {
            console.log('status update was failed with an error:', e);
          };

          updateStatus(
            id,
            mappingStatus,
            userToken,
            statusUpdateSuccess,
            statusUpdateFail,
            statusApiUri,
          );
        }

        setSelectedNotificatoinsLists([]);
        // eslint-disable-next-line no-use-before-define
        setDisplayModal(false);
      }}
      primary
    />,
  ];

  const DialogWindow = ({
    className,
    handleExitModal,
  }) => (
    <Window
      width="50vw"
      height="40vh"
      title="Comments and Status Change"
      withHeaderCloseButton
      onWindowOpen={() => null}
      onWindowClose={() => {
        setSelectedNotificatoinsLists([]);
        handleExitModal();
      }}
      withShadow
      key="comment-and-status-window"
      actionButtons={modalWindowButtons}
      className={className}
    >
      <div className="row small-12">
        <div className="small-4 column">Notifications:</div>
        <div className="small-8 column">
          <SendNotificationUI
            options={notificationsList}
            selectedOption={selectedNotificationsLists}
            onChange={values => setSelectedNotificatoinsLists(values)}
          />
        </div>
      </div>

      <div className="row small-12">
        <div className="small-4 column">Status:</div>
        <div className="small-8 column">
          {statusChangeControl}
        </div>
      </div>

      <div className="row small-12">
        <div className="column">
          <div>Comments:</div>
          <textarea id="text-editor" />
        </div>
      </div>
    </Window>
  );

  DialogWindow.propTypes = {
    className: PropTypes.string,
    handleExitModal: PropTypes.func.isRequired,
  };

  DialogWindow.defaultProps = {
    className: null,
  };

  const {
    displayModal,
    setDisplayModal,
    Modal,
  } = useModal(ModalBackdrop, DialogWindow);

  return (
    <div className="comments-section">
      <div className="row">
        <div className="column medium-12">
          <button type="button" className="button" onClick={() => setDisplayModal(true)}>
            Comment / Change Status
          </button>

          {displayModal && <Modal handleExitModal={() => setDisplayModal(false)} />}
        </div>
      </div>
    </div>
  );
};

CommentsAndStatusModal.propTypes = {
  id: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  statusChangeControl: PropTypes.node.isRequired,
  cookies: PropTypes.shape({}).isRequired,
  afterSaveCallback: PropTypes.func.isRequired,
  notificationsList: PropTypes.objectOf(
    PropTypes.string,
  ).isRequired,
  mappingStatus: PropTypes.string.isRequired,
  originalMappingStatus: PropTypes.string.isRequired,
  commentsApiUri: PropTypes.string.isRequired,
  statusApiUri: PropTypes.string.isRequired,
};

export default withRouter(withCookies(CommentsAndStatusModal));
