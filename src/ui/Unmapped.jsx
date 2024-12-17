import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { withCookies } from "react-cookie";

import LoadingSpinner from "./components/LoadingSpinner";
import UnmappedHeader from "./components/UnmappedHeader";
import UnmappedComments from "./components/comments/UnmappedComments";
import StatusIcon from "./components/status/StatusIcon";
import StatusText from "./components/status/StatusText";
import { statusesList } from "./util/util";

import "../styles/Unmapped.scss";
import "../../node_modules/easymde/dist/easymde.min.css";

class Unmapped extends Component {
  defaultState = {
    details: null,
    status: null,
    comments: null,
    id: null,
    labels: null,
    originalStatus: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.defaultState,
    };
  }

  componentDidMount() {
    const { isLoggedIn } = this.props; // Access isLoggedIn prop
    console.log("Is user logged in?", isLoggedIn);

    const {
      match: { params },
    } = this.props;
    const { id } = params;

    this.getUnmappedDetails(id, isLoggedIn);
  }

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
    const { history, cookies, hasValidAuthenticationToken } = this.props;

    const tokenIsNotExpired = hasValidAuthenticationToken();
    const config = {};
    const apiCalls = [
      axios.get(
        `${process.env.REACT_APP_API_URL}/unmapped/${id}/?format=json`,
        config
      ),
      axios.get(
        `${process.env.REACT_APP_API_URL}/unmapped/${id}/labels/?format=json`,
        config
      ),
    ];

    if (isLoggedIn && tokenIsNotExpired) {
      config.headers = {
        Authorization: `Bearer ${cookies.get("userToken")}`,
      };

      apiCalls.push(
        axios.get(
          `${process.env.REACT_APP_API_URL}/unmapped/${id}/comments/?format=json`,
          config
        )
      );
    }

    axios
      .all(apiCalls)
      .then(
        axios.spread((unmappedResponse, labelsResponse, commentsResponse) => {
          const details = unmappedResponse.data;
          const comments =
            (commentsResponse && commentsResponse.data.comments) || [];
          const { status } = details.entry;

          this.setState({
            details,
            status,
            comments: comments.reverse(),
            originalStatus: status,
          });
        })
      )
      .catch(() => {
        history.push(`${process.env.REACT_APP_BASE_URL}/error`);
      });
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const { details, status, originalStatus, comments } = this.state;

    const { isLoggedIn } = this.props;

    const { entry } = details;
    const { id } = entry;

    return (
      <Fragment>
        <div className="row column medium-12">
          <div className="status-wrapper">
            <StatusIcon status={status} />
            <StatusText value={status} labels={statusesList} />
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
              originalMappingStatus={originalStatus}
              afterSaveCallback={this.getUnmappedDetails}
              onMappingStatusChange={this.onStatusChange}
              notificationsList={details.emailRecipientsList}
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
  cookies: PropTypes.shape({}).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  hasValidAuthenticationToken: PropTypes.func.isRequired,
};

export default withCookies(withRouter(Unmapped));
