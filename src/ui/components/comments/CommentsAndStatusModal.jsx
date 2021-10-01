import React, { useState, useCallback } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { withCookies } from "react-cookie";
import ReactModal from "react-modal";
import SimpleMDE from "simplemde";

import SendNotificationUI from "../SendNotificationUI";
import "../../../../node_modules/simplemde/dist/simplemde.min.css";
import "../../../styles/CommentsAndStatusModal.scss";

ReactModal.setAppElement("#root");

const createId = (id, mapped) =>
  `comments-${mapped ? "mapped" : "unmapped"}-${id}`;

const onCommentTextChange = (id, textEditor) => {
  const text = textEditor.value();

  localStorage.setItem(createId(id), text);
};

/* eslint-disable consistent-return */
const saveComment = (
  id,
  textEditor,
  notificationLists,
  userToken,
  onSuccess,
  onFailure,
  apiUri
) => {
  const notificationListsIds = notificationLists.map((l) =>
    parseInt(l.value, 10)
  );

  const comment = {
    email_recipient_ids: notificationListsIds,
    text: textEditor.value(),
  };

  if (!comment.text || comment.text.length === 0) {
    return false;
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };

  axios.post(apiUri, comment, config).then(onSuccess).catch(onFailure);
};

const updateStatus = (
  id,
  status,
  notificationLists,
  userToken,
  onSuccess,
  onFailure,
  apiUri
) => {
  const notificationListsIds = notificationLists.map((l) =>
    parseInt(l.value, 10)
  );

  const changes = {
    email_recipient_ids: notificationListsIds,
    status,
  };

  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  axios.put(apiUri, changes, config).then(onSuccess).catch(onFailure);
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
  const [selectedNotificationsLists, setSelectedNotificatoinsLists] = useState(
    []
  );
  const [displayModal, setDisplayModal] = useState(false);

  const textEditorRef = useCallback(() => {
    if (textEditorRef.current !== null) {
      const textEditor = new SimpleMDE({
        element: textEditorRef.current,
        initialValue: localStorage.getItem(createId(id)) || "",
        hideIcons: ["image"],
      });

      textEditor.codemirror.on("change", () =>
        onCommentTextChange(id, textEditor)
      );
      textEditor.render(document.getElementById("text-editor"));
      textEditor.value(localStorage.getItem(createId(id)) || "");
    }
  }, [id]);

  if (!isLoggedIn) {
    return null;
  }

  const handleSaveModal = () => {
    const addCommentSuccess = () => {
      console.log("comment was added successfully.");
      textEditor.value("");
      setSelectedNotificatoinsLists([]);
      afterSaveCallback(id, isLoggedIn);
      localStorage.removeItem(createId(id));
    };
    const addCommentFail = (e) => {
      console.log("add comment was failed with an error:", e);
    };

    saveComment(
      id,
      textEditor,
      selectedNotificationsLists,
      userToken,
      addCommentSuccess,
      addCommentFail,
      commentsApiUri
    );

    if (originalMappingStatus !== mappingStatus) {
      const statusUpdateSuccess = () => {
        console.log("status was updated successfully.");
      };
      const statusUpdateFail = (e) => {
        console.log("status update was failed with an error:", e);
      };

      updateStatus(
        id,
        mappingStatus,
        selectedNotificationsLists,
        userToken,
        statusUpdateSuccess,
        statusUpdateFail,
        statusApiUri
      );
    }

    setSelectedNotificatoinsLists([]);
    // eslint-disable-next-line no-use-before-define
    setDisplayModal(false);
  };

  const userToken = cookies.get("userToken");

  let textEditor = null;

  return (
    <div className="comments-section">
      <div className="row">
        <div className="column medium-12">
          <button
            type="button"
            className="button"
            onClick={() => setDisplayModal(true)}
          >
            Comment / Change Status
          </button>

          <ReactModal
            isOpen={displayModal}
            contentLabel="Comments and Status Change"
          >
            <div className="row small-12">
              <div className="small-4 column">Notifications:</div>
              <div className="small-8 column">
                <SendNotificationUI
                  options={notificationsList}
                  selectedOption={selectedNotificationsLists}
                  onChange={(values) => setSelectedNotificatoinsLists(values)}
                />
              </div>
            </div>

            <div className="row small-12">
              <div className="small-4 column">Status:</div>
              <div className="small-8 column">{statusChangeControl}</div>
            </div>

            <div className="row small-12">
              <div className="column">
                <div>Comments:</div>
                <textarea ref={textEditorRef} />
              </div>
            </div>

            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setSelectedNotificatoinsLists([]);
                // eslint-disable-next-line no-use-before-define
                setDisplayModal(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={handleSaveModal}
            >
              Submit
            </button>
          </ReactModal>
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
  notificationsList: PropTypes.objectOf(PropTypes.string).isRequired,
  mappingStatus: PropTypes.string.isRequired,
  originalMappingStatus: PropTypes.string.isRequired,
  commentsApiUri: PropTypes.string.isRequired,
  statusApiUri: PropTypes.string.isRequired,
};

export default withRouter(withCookies(CommentsAndStatusModal));
