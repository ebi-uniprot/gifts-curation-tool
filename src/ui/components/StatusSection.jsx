import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import StatusIndicator from './StatusIndicator';
import StatusChangeControl from './StatusChangeControl';

import '../../styles/StatusSection.scss';

class StatusSection extends Component {
  state = {
    statusOptions: [],
  };

  componentDidMount() {
    const apiURI = `${API_URL}/mappings/statuses`;
    axios.get(apiURI).then(d => this.setState({ statusOptions: d.data }));
  }

  statusToTextValue(status) {
    const { statusOptions } = this.state;
    const item = Object.values(statusOptions)
      .find(el => el.id === status);

    return (item)
      ? item.description
      : status;
  }

  render() {
    const {
      status,
      onChange,
      isLoggedIn,
      id,
      apiUri,
      editable,
    } = this.props;
    const { statusOptions } = this.state;

    return (
      <div className="status-section">
        <StatusIndicator status={this.statusToTextValue(status)} />
        {(isLoggedIn && editable) ? (
          <StatusChangeControl
            id={id}
            status={status}
            options={statusOptions}
            onChange={onChange}
            apiUri={apiUri}
          />
        ) : (
          <span>{this.statusToTextValue(status)}</span>
        )}
      </div>
    );
  }
}

StatusSection.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  apiUri: PropTypes.string.isRequired,
  editable: PropTypes.bool,
};

StatusSection.defaultProps = {
  editable: null,
};

export default StatusSection;
