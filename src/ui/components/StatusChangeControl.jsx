import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import '../../styles/StatusChangeControl.css';

class StatusChangeControl extends Component {
  state= {
    editMode: false,
    originalStatus: null,
  }

  componentDidMount() {
    const { status } = this.props;
    this.setState({ originalStatus: status });
  }

  updateStatus = () => {
    const {
      mappingId,
      status,
      history,
      cookies,
    } = this.props;

    const apiURI = `${API_URL}/mapping/${mappingId}/status/`;
    const changes = {
      status,
    };

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .put(apiURI, changes, config)
      .then(response => {})
      .catch(e => {
        console.log(e);
        history.push('/error');
      });
  }

  enableEditMode = e => {
    this.setState({ editMode: true });

    e.preventDefault();
    return false;
  }

  disableEditMode = () => {
    const { originalStatus } = this.state;
    const { onChange } = this.props;

    this.setState({ editMode: false });

    onChange({
      target: {
        value: originalStatus,
      }
    });
  }

  render() {
    const { editMode } = this.state;
    const { options, onChange, status } = this.props;

    const statusList = Object.keys(options)
      .map(key => <option value={key} key={key}>{options[key]}</option>);

    const StatusChangeForm = () => (
      <div className="status-change-form">
        <select
          className="status-modifier input-group-field"
          onChange={onChange}
          value={status}
        >
          {statusList}
        </select>
        <div className="button-group">
          <button className="button button--primary" onClick={this.updateStatus}>
              Save
          </button>
          <button className="button button--primary" onClick={this.disableEditMode}>
              Cancel
          </button>
        </div>
      </div>
    );

    const Status = () => (
      <div>
        <span>{options[status]}</span>
        &nbsp;
        <a href="#" onClick={this.enableEditMode}>Edit</a>
      </div>
    );

    return (
      <Fragment>
        {(editMode)
          ? <StatusChangeForm />
          : <Status />
        }
      </Fragment>
    )
  }
};

export default withRouter(withCookies(StatusChangeControl));