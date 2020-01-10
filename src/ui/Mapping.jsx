import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import LoadingSpinner from './components/LoadingSpinner';
import Alignment from './components/alignment/Alignment';
import LabelsSection from './components/label/LabelsSection';
import RelatedMappingsSection from './components/RelatedMappingsSection';
import MappingHeader from './components/MappingHeader';
import StatusIcon from './components/status/StatusIcon';
import StatusText from './components/status/StatusText';
import MappingComments from './components/comments/MappingComments';
import { statusesList } from './util/util';

import '../styles/Mapping.scss';

class Mapping extends Component {
  defaultState = {
    details: null,
    status: null,
    comments: null,
    mappingId: null,
    labels: null,
    showAlignment: true,
    originalStatus: null,
  };

  constructor(props) {
    super(props);

    const {
      match: { params },
      isLoggedIn,
    } = props;
    const { mappingId } = params;

    this.state = {
      ...this.defaultState,
      mappingId,
    };

    this.getMappingDetails(mappingId, isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params },
      isLoggedIn,
      location,
    } = this.props;
    const { mappingId } = params;

    if (mappingId !== prevProps.match.params.mappingId) {
      this.getMappingDetails(mappingId, isLoggedIn);
    }
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value,
    });
  };

  getMappingDetails = (mappingId, isLoggedIn) => {
    const { history, cookies, hasValidAuthenticationToken } = this.props;

    const tokenIsNotExpired = hasValidAuthenticationToken();
    const config = {};
    const apiCalls = [
      axios.get(`${API_URL}/mapping/${mappingId}/?format=json`, config),
      axios.get(`${API_URL}/mapping/${mappingId}/labels/?format=json`, config),
    ];

    if (isLoggedIn && tokenIsNotExpired) {
      config.headers = {
        Authorization: `Bearer ${cookies.get('userToken')}`,
      };

      apiCalls.push(axios.get(`${API_URL}/mapping/${mappingId}/comments/?format=json`, config));
    }

    axios
      .all(apiCalls)
      .then(axios.spread((mappingResponse, labelsResponse, commentsResponse) => {
        const details = mappingResponse.data;
        const comments = (commentsResponse && commentsResponse.data.comments) || [];
        const { labels } = labelsResponse.data;
        const { status } = details.mapping;

        this.setState({
          details,
          status,
          labels,
          comments: comments.reverse(),
          originalStatus: status,
        });
      }))
      .catch(() => {
        history.push(`${BASE_URL}/error`);
      });
  };

  toggleDisplayAlignment() {
    const { showAlignment } = this.state;

    this.setState({
      showAlignment: !showAlignment,
    });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const {
      details,
      status,
      originalStatus,
      comments,
      labels,
      showAlignment,
    } = this.state;

    const {
      isLoggedIn,
    } = this.props;

    const { mapping, relatedEntries, taxonomy } = details;
    const { mappingId } = mapping;

    return (
      <Fragment>
        <div className="row column medium-12">
          <div className="status-wrapper">
            <StatusIcon status={status} />
            <StatusText value={status} labels={statusesList} />
          </div>
          <MappingHeader mapping={mapping} taxonomy={taxonomy} />
        </div>
        <div className="row column medium-12">
          <LabelsSection
            mappingId={mappingId}
            isLoggedIn={isLoggedIn}
            labels={labels}
            afterChangeCallback={this.getMappingDetails}
          />
        </div>

        <div className="row column medium-12">
          <button
            type="button"
            className="button"
            onClick={() => this.toggleDisplayAlignment()}
          >
            {(showAlignment) ? 'Hide ' : 'Show '}
            Alignment
          </button>
          {(showAlignment)
            // This 'mappingId' is set at a different time
            // from 'mapping.mappingId'
            // eslint-disable-next-line react/destructuring-assignment
            ? <Alignment mappingId={this.state.mappingId} />
            : null }
        </div>

        <div className="row column medium-12">
          <h3>Related Mappings</h3>
          <RelatedMappingsSection mappings={relatedEntries} />
        </div>

        <div className="row mapping__comments__wrapper">
          <div className="column medium-12">

            <MappingComments
              id={mappingId}
              isLoggedIn={isLoggedIn}
              comments={comments}
              mappingStatus={status}
              originalMappingStatus={originalStatus}
              afterSaveCallback={this.getMappingDetails}
              onMappingStatusChange={this.onStatusChange}
              notificationsList={details.emailRecipientsList}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Mapping.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      mappingId: PropTypes.string,
    }),
  }).isRequired,
  cookies: PropTypes.shape({}).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  hasValidAuthenticationToken: PropTypes.func.isRequired,
};

export default withCookies(withRouter(Mapping));
