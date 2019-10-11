import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import '../../styles/StatusChangeControl.scss';

class StatusChangeControl extends Component {
  constructor(props) {
    super(props);
    const { status } = props;

    this.state = {
      originalStatus: status,
    };
  }

  state = {
    editMode: false,
    originalStatus: null,
  };

  updateStatus = () => {
    const {
      status,
      history,
      cookies,
      apiUri,
    } = this.props;

    const changes = {
      status,
    };

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('userToken')}` },
    };

    axios
      .put(apiUri, changes, config)
      .then(() => {
        this.setState({ editMode: false });
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  enableEditMode = (e) => {
    this.setState({ editMode: true });

    e.preventDefault();
    return false;
  };

  disableEditMode = () => {
    const { originalStatus } = this.state;
    const { onChange } = this.props;

    this.setState({ editMode: false });

    onChange({
      target: {
        value: originalStatus,
      },
    });
  };

  statusToTextValue(status) {
    const { options } = this.props;
    const item = Object.values(options)
      .find(el => el.id === status);

    return (item)
      ? item.description
      : status;
  }

  render() {
    const { editMode } = this.state;
    const { options, onChange, status } = this.props;

    const statusList = options.map(opt => (
      <option value={opt.description} key={`status_${opt.id}`}>
        {opt.description}
      </option>
    ));

    const StatusChangeForm = () => (
      <div className="status-change-form">
        <select
          className="status-modifier input-group-field"
          onChange={onChange}
          value={this.statusToTextValue(status)}
        >
          {statusList}
        </select>
        <div className="button-group">
          <button
            type="button"
            className="button button--primary"
            onClick={this.updateStatus}
          >
            Save
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={this.disableEditMode}
          >
            Cancel
          </button>
        </div>
      </div>
    );

    const Status = () => (
      <Fragment>
        <span>{this.statusToTextValue(status)}</span>
        &nbsp;
        <button
          type="button"
          className="button"
          href="#"
          onClick={this.enableEditMode}
        >
          Edit
        </button>
      </Fragment>
    );

    return <Fragment>{editMode ? <StatusChangeForm /> : <Status />}</Fragment>;
  }
}

StatusChangeControl.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  apiUri: PropTypes.string.isRequired,
  history: PropTypes.shape({}).isRequired,
  cookies: PropTypes.shape({}).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withRouter(withCookies(StatusChangeControl));
