import React, { Component } from "react";
import { Switch, Route, withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import queryString from "query-string";
import * as jwt from "jsonwebtoken";
import axios from "axios";

import packageJson from "../../package.json";
import Layout from "./Layout";
import Home from "./Home";
import Mappings from "./Mappings";
import Unmapped from "./Unmapped";
import Login from "./Login";
import Logout from "./Logout";
import Mapping from "./Mapping";
import Broken from "./Broken";
import Message from "./components/Message";
import NoResults from "./NoResults";
import Feedback from "./Feedback";
import authConfig from "../authConfig";
import { getSecondsSinceEpoch } from "./util/util";

import "../styles/Gifts.scss";

class App extends Component {
  defaultState = {
    // eslint-disable-next-line react/destructuring-assignment
    searchTerm: queryString.parse(this.props.location.search).searchTerm
      ? // eslint-disable-next-line react/destructuring-assignment
        queryString.parse(this.props.location.search).searchTerm
      : "",
    authenticated: false,
    userToken: null,
    hasExpiredToken: false,
    user: {
      id: null,
      name: null,
    },
    message: null,
    offset: 0,
    limit: 15,
    activeFacets: {},
    initialPage: 0,
    selectedFilters: {},
    frontendVersion: `${packageJson.version}`,
    backendVersion: null,
    statusValues: {},
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentWillMount() {
    this.setAuthState();

    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_URL}/version/?format=json`),
        axios.get(
          `${process.env.REACT_APP_API_URL}/mappings/statuses/?format=json`
        ),
      ])
      .then((response) => {
        this.setState({
          backendVersion: response[0].data.version,
          statusValues: response[1].data,
        });
      });
  }

  setAuthState(successCallback = () => null, failureCallback = () => null) {
    const { cookies } = this.props;

    try {
      const rawUserToken = cookies.get("userToken");

      if (!this.verifyJWT()) {
        return false;
      }

      this.setState(
        {
          authenticated: true,
          userToken: rawUserToken,
        },
        successCallback
      );

      return true;
    } catch (e) {
      this.setState(
        {
          authenticated: false,
          userToken: null,
        },
        failureCallback
      );

      return false;
    }
  }

  verifyJWT = () => {
    const { cookies } = this.props;

    const rawUserToken = cookies.get("userToken");
    const userToken = jwt.verify(rawUserToken, authConfig.aap.public_key, {
      algorithm: authConfig.aap.algorithm,
    });

    if (
      typeof userToken.exp !== "undefined" &&
      userToken.exp <= getSecondsSinceEpoch()
    ) {
      cookies.remove("userToken", { path: "/" });

      this.tokenIsExpired();
      return false;
    }

    return true;
  };

  onLogout = () => {
    const { history } = this.props;

    this.setState(this.defaultState);
    history.push(`${process.env.REACT_APP_BASE_URL}/`);
  };

  setMessage = (title, text, isError) => {
    this.setState({
      message: {
        title,
        text,
        isError,
      },
    });
  };

  exploreMappingsAction = () => {
    const { history } = this.props;
    this.setState({ searchTerm: "" });
    history.push(`${process.env.REACT_APP_BASE_URL}/mappings`);
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;

    this.setState({
      searchTerm: input.split(".")[0].trim(),
      offset: 0,
      limit: 15,
      initialPage: 0,
      activeFacets: {},
      selectedFilters: {},
    });

    history.push(
      `${process.env.REACT_APP_BASE_URL}/mappings?searchTerm=${input}`
    );
    e.preventDefault();
  };

  clearSearchTerm = (callback) => this.setState({ searchTerm: "" }, callback);

  onLoginSuccess = (user) => {
    const { history } = this.props;

    if (this.setAuthState()) {
      this.setState(
        {
          user,
        },
        () => {
          history.push(`${process.env.REACT_APP_BASE_URL}/`);
        }
      );
    }
  };

  onLoginFailure = () => {
    const { cookies } = this.props;

    this.setState(this.defaultState);
    cookies.set("userToken", "", { path: "/" });
  };

  tokenIsExpired = () => {
    this.setState({
      authenticated: false,
      hasExpiredToken: true,
      user: {
        id: null,
        name: null,
      },
    });
  };

  hasValidAuthenticationToken = () => {
    const { cookies } = this.props;
    const rawUserToken = cookies.get("userToken") || undefined;

    try {
      if (!rawUserToken) {
        return false;
      }

      return this.verifyJWT();
    } catch (e) {
      return false;
    }
  };

  clearMessage = () => this.setState({ message: null });

  clearExpiredLoginMessage = () => {
    const { cookies } = this.props;

    this.setState({
      hasExpiredToken: false,
    });

    cookies.remove("userToken", { path: "/" });
  };

  exploreMappingsByOrganism = (organism) => {
    const activeFacetsCopy = {
      activeFacets: {},
      organism,
      offset: 0,
      limit: 15,
      initialPage: 0,
      searchTerm: "",
      selectedFilters: {},
    };

    this.setState(
      {
        activeFacets: activeFacetsCopy,
      },
      () => {
        this.exploreMappingsAction();
      }
    );
  };

  toggleFilter = (filter) => {
    const { selectedFilters } = this.state;
    const { group, value } = filter;
    const updated = { ...selectedFilters };

    // to reset the 'Chromosome' filters when the 'Organism' selection changes.
    if (group === "organism") {
      if (selectedFilters.organism && !selectedFilters.organism[value]) {
        updated.chromosome = {};
      }

      // toggle organism: select/deselect.
      if (updated.organism && updated.organism[value]) {
        updated.organism[value] = false;
        updated.chromosome = {};
      } else {
        updated.organism = {};
        updated.organism[value] = true;
      }

      this.setState(
        {
          selectedFilters: updated,
        },
        this.selectedFiltersToActiveFacets
      );

      return;
    }

    // first time selecting a filter
    if (!updated[group]) {
      updated[group] = {};
      updated[group][value] = true;

      this.setState(
        {
          selectedFilters: updated,
        },
        this.selectedFiltersToActiveFacets
      );

      return;
    }

    // toggling an already selected filter
    const originalValue = updated[group][value];
    updated[group][value] = !originalValue;

    this.setState(
      {
        selectedFilters: updated,
      },
      this.selectedFiltersToActiveFacets
    );
  };

  setResults = (data) => {
    this.setState({
      params: data.params,
      facets: data.facets,
      results: data.results,
      totalCount: data.totalCount,
      displayIsoforms: data.displayIsoforms,
    });
  };

  changePageParams = (params) => {
    const { offset, initialPage } = this.state;

    if (params.offset === offset && params.initialPage === initialPage) {
      return;
    }

    this.setState({
      offset: params.offset,
      initialPage: params.initialPage,
    });
  };

  resetSearchAndFacets = (callback) => {
    this.setState(
      {
        searchTerm: "",
        offset: 0,
        limit: 15,
        activeFacets: {},
        initialPage: 0,
        selectedFilters: {},
      },
      () => {
        if (typeof callback === "function") {
          callback();
        }
      }
    );
  };

  goToMappingsPage = (e) => {
    const { history } = this.props;

    const callback = () =>
      history.push(`${process.env.REACT_APP_BASE_URL}/mappings`);
    this.resetSearchAndFacets(callback);
    e.preventDefault();
  };

  selectedFiltersToActiveFacets() {
    const { selectedFilters } = this.state;

    const convert = (filter, active) => {
      const values = [];
      let mainKey;

      Object.keys(filter).forEach((key) => {
        const [facetKey, facetValue] = key.split(":");
        mainKey = facetKey;

        if (filter[key]) {
          values.push(facetValue);
        }
      });

      if (values.length > 0) {
        // eslint-disable-next-line no-param-reassign
        active[mainKey] = values.join(",");
      }
    };

    const activeFacets = {};

    Object.values(selectedFilters).forEach((filter) =>
      convert(filter, activeFacets)
    );

    this.setState({
      activeFacets,
    });
  }

  render() {
    const {
      authenticated,
      message,
      exploreMappingsByOrganism,
      hasExpiredToken,
    } = this.state;

    const LoginComponent = () => (
      <Login
        onLoginSuccess={this.onLoginSuccess}
        onLoginFailure={this.onLoginFailure}
      />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;
    const appProps = {
      ...this.state,
      handleSearchSubmit: this.handleSearchSubmit,
      tokenIsExpired: this.tokenIsExpired,
      setMessage: this.setMessage,
      clearSearchTerm: this.clearSearchTerm,
      exploreMappingsByOrganism: this.exploreMappingsByOrganism,
      getFacetsAsString: this.getFacetsAsString,
      setResults: this.setResults,
      changePageParams: this.changePageParams,
      resetSearchAndFacets: this.resetSearchAndFacets,
      goToMappingsPage: this.goToMappingsPage,
      toggleFilter: this.toggleFilter,
      hasValidAuthenticationToken: this.hasValidAuthenticationToken,
    };

    const tokenIsExpiredMessage = {
      isError: true,
      title: "Your login token is expired",
      text: (
        <Link to={`${process.env.REACT_APP_BASE_URL}/login`}>
          Click here to login again.
        </Link>
      ),
    };
    return (
      <Layout {...appProps}>
        <section id="main-content-area" role="main">
          <div id="root">
            {message !== null ? (
              <Message details={message} onClose={this.clearMessage} />
            ) : null}
            {hasExpiredToken && (
              <Message
                details={tokenIsExpiredMessage}
                onClose={this.clearExpiredLoginMessage}
              />
            )}
            <Switch>
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/`}
                render={() => <Home {...appProps} />}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/mappings`}
                render={() => (
                  <Mappings
                    {...appProps}
                    defaultOrganism={exploreMappingsByOrganism}
                  />
                )}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/login`}
                component={LoginComponent}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/logout`}
                component={LogoutComponent}
              />
              <Route
                path={`${process.env.REACT_APP_BASE_URL}/mapping/:mappingId`}
                render={({ match }) => (
                  <Mapping
                    match={match}
                    isLoggedIn={authenticated}
                    {...appProps}
                  />
                )}
              />
              <Route
                path={`${process.env.REACT_APP_BASE_URL}/unmapped/:id`}
                render={({ match }) => (
                  <Unmapped
                    match={match}
                    isLoggedIn={authenticated}
                    {...appProps}
                  />
                )}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/error`}
                render={() => <Broken {...appProps} />}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/feedback`}
                component={Feedback}
              />
              <Route
                exact
                path={`${process.env.REACT_APP_BASE_URL}/no-results`}
                render={() => <NoResults {...appProps} />}
              />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

App.propTypes = {
  cookies: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(withCookies(App));
