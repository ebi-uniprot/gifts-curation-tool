import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/Message.css';

const Message = props => (
  <div className={`message callout ${props.details.isError ? 'alert' : 'primary'}`}>
    <h5>{props.details.title}</h5>
    <p>{props.details.text}</p>
    <button onClick={props.onClose} className="close-button" aria-label="Dismiss alert" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

Message.propTypes = {
  details: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Message;
