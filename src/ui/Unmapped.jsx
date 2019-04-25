import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import decode from 'jwt-decode';

import LoadingSpinner from './components/LoadingSpinner';
import UnmappedHeader from './components/UnmappedHeader';
import RelatedMappingsSection from './components/RelatedMappingsSection';
import UnmappedStatusControl from './components/UnmappedStatusControl';
import UnmappedComments from './components/comments/UnmappedComments';

import '../styles/Unmapped.scss';
import '../../node_modules/simplemde/dist/simplemde.min.css';

class Unmapped extends Component {
  constructor(props) {
    super(props);

    const {
      match: { params },
      isLoggedIn,
    } = props;
    const { id } = params;

    this.state = {
      ...this.defaultState,
      id,
    };

    this.getUnmappedDetails(id, isLoggedIn);
  }

  defaultState = {
    details: null,
    status: null,
    comments: null,
    isLoggedIn: null,
    id: null,
    labels: null,
  };

  componentDidUpdate(prevProps) {
    const {
      match: { params },
      isLoggedIn,
      location,
    } = this.props;
    const { id } = params;

    if (id !== prevProps.match.params.id) {
      this.getMappingDetails(id, isLoggedIn);
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

  getUnmappedDetails = (id, isLoggedIn) => {
    const { history, cookies } = this.props;

    const tokenIsNotExpired = this.forceLoginIfTokenIsExpired();
    const config = {};
    const apiCalls = [
      axios.get(`${API_URL}/unmapped/${id}/?format=json`, config),
      axios.get(`${API_URL}/unmapped/${id}/labels/?format=json`, config),
    ];

    if (isLoggedIn && tokenIsNotExpired) {
      config.headers = {
        Authorization: `Bearer ${cookies.get('jwt')}`,
      };

      apiCalls.push(axios.get(`${API_URL}/unmapped/${id}/comments/?format=json`, config));
    }

    axios
      .all(apiCalls)
      .then(axios.spread((unmappedResponse, labelsResponse, commentsResponse) => {
        const details = unmappedResponse.data;
        const comments = (commentsResponse && commentsResponse.data.comments) || [];
        const { labels } = labelsResponse.data;
        const { status } = details.entry;

        this.setState({
          details,
          status: status || 'NOT_REVIEWED',
          labels,
          comments: comments.reverse(),
          isLoggedIn: isLoggedIn && tokenIsNotExpired,
        });
      }))
      .catch(() => {
        history.push(`${BASE_URL}/error`);
      });
  }

  forceLoginIfTokenIsExpired = () => {
    const { cookies, tokenIsExpired } = this.props;
    const jwt = cookies.get('jwt') || undefined;
    let decoded = {};

    if (typeof jwt !== 'undefined' && jwt !== 'EXPIRED') {
      decoded = decode(jwt);
    }

    const utcNow = parseInt(new Date().getTime() / 1000, 10);

    if (typeof decoded.exp !== 'undefined' && decoded.exp - utcNow <= 0) {
      cookies.remove('authenticated', { path: '/' });
      cookies.set('jwt', 'EXPIRED', { path: '/' });

      tokenIsExpired();
      return false;
    }

    return true;
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const {
      details,
      status,
      comments,
      isLoggedIn,
      labels,
    } = this.state;

    const { match } = this.props;
    const { params } = match;
    const { entry, relatedEntries } = details;
    const { id } = entry;

    return (
      <Fragment>
        <div className="row column medium-12">
          <div className="status-wrapper">
            <UnmappedStatusControl
              id={id}
              isLoggedIn={isLoggedIn}
              status={status}
              onChange={this.onStatusChange}
            />
          </div>
          <UnmappedHeader unmapped={details} />
        </div>
        <div className="row mapping__comments__wrapper">
          <div className="column medium-12">
            <UnmappedComments
              id={id}
              isLoggedIn={isLoggedIn}
              comments={comments}
              mappingStatus={status}
              afterSaveCallback={this.getUnmappedDetails}
              onMappingStatusChange={this.onStatusChange}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Unmapped.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  tokenIsExpired: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default withCookies(withRouter(Unmapped));
