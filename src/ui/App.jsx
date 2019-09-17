import React, { Component } from 'react';
import {
  Switch,
  Route,
  withRouter,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import queryString from 'query-string';
import * as jwt from 'jsonwebtoken';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Unmapped from './Unmapped';
import Login from './Login';
import Logout from './Logout';
import Mapping from './Mapping';
import Broken from './Broken';
import Message from './components/Message';
import NoResults from './NoResults';
import Feedback from './Feedback';
import authConfig from '../auth-config';

import '../styles/Gifts.scss';

class App extends Component {
  defaultState = {
    // eslint-disable-next-line react/destructuring-assignment
    searchTerm: queryString.parse(this.props.location.search).searchTerm
      // eslint-disable-next-line react/destructuring-assignment
      ? queryString.parse(this.props.location.search).searchTerm
      : '',
    authenticated: false,
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
  };

  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentWillMount() {
    this.getAuthCookiesAndSetAuthState();
  }

  getAuthCookiesAndSetAuthState(successCallback = () => null, failurCallback = () => null) {
    const { cookies } = this.props;

    try {
      const rawUserToken = cookies.get('userToken');
      const userToken = jwt.verify(
        rawUserToken,
        authConfig.aap.public_key,
        { algorithm: 'RS256' },
      );

      const utcNow = parseInt(new Date().getTime() / 1000, 10);

      if (typeof userToken.exp !== 'undefined' && userToken.exp - utcNow <= 0) {
        cookies.remove('userToken', { path: '/' });

        this.tokenIsExpired();
        return false;
      }

      this.setState({
        authenticated: true,
        jwt: rawUserToken,
      }, successCallback);

      return true;
    } catch (e) {
      this.setState({
        authenticated: false,
        jwt: null,
      }, failurCallback);

      return false;
    }
  }

  onLogout = () => {
    const { history } = this.props;

    this.setState(this.defaultState);
    history.push(`${BASE_URL}/`);
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
    this.setState({ searchTerm: '' });
    history.push(`${BASE_URL}/mappings`);
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;

    this.setState({
      searchTerm: input
        .split('.')[0]
        .trim(),
      offset: 0,
      limit: 15,
      initialPage: 0,
      activeFacets: {},
      selectedFilters: {},
    });

    history.push(`${BASE_URL}/mappings?searchTerm=${input}`);
    e.preventDefault();
  };

  clearSearchTerm = callback => this.setState({ searchTerm: '' }, callback);

  onLoginSuccess = (user) => {
    const { history } = this.props;

    if (this.getAuthCookiesAndSetAuthState()) {
      this.setState({
        user,
      }, () => {
        history.push(`${BASE_URL}/`);
      });
    }
  };

  onLoginFailure = () => {
    const { cookies } = this.props;

    this.setState(this.defaultState);
    cookies.set('userToken', '', { path: '/' });
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
    const rawUserToken = cookies.get('userToken') || undefined;

    try {
      if (!rawUserToken) {
        return false;
      }

      const decoded = jwt.verify(rawUserToken, authConfig.aap.public_key, { algorithm: 'RS256' });

      const utcNow = parseInt(new Date().getTime() / 1000, 10);

      if (typeof decoded.exp !== 'undefined' && decoded.exp - utcNow <= 0) {
        cookies.remove('userToken', { path: '/' });

        this.tokenIsExpired();
        return false;
      }

      return true;
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

    cookies.remove('userToken', { path: '/' });
  };

  exploreMappingsByOrganism = (organism) => {
    const activeFacetsCopy = {
      activeFacets: {},
      organism,
      offset: 0,
      limit: 15,
      initialPage: 0,
      searchTerm: '',
      selectedFilters: {},
    };

    this.setState({
      activeFacets: activeFacetsCopy,
    }, () => {
      this.exploreMappingsAction();
    });
  };

  toggleFilter = (filter) => {
    const { selectedFilters } = this.state;
    const { group, value } = filter;
    const updated = { ...selectedFilters };

    // to reset the 'Chromosome' filters when the 'Organism' selection changes.
    if (group === 'organism') {
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

      this.setState({
        selectedFilters: updated,
      }, this.selectedFiltersToActiveFacets);

      return;
    }

    // first time selecting a filter
    if (!updated[group]) {
      updated[group] = {};
      updated[group][value] = true;

      this.setState({
        selectedFilters: updated,
      }, this.selectedFiltersToActiveFacets);

      return;
    }

    // toggling an already selected filter
    const originalValue = updated[group][value];
    updated[group][value] = !originalValue;

    this.setState({
      selectedFilters: updated,
    }, this.selectedFiltersToActiveFacets);
  };

  setResults = (data) => {
    this.setState({
      params: data.params,
      facets: data.facets,
      results: data.results,
      totalCount: data.totalCount,
      displayIsoforms: data.displayIsoforms,
    });
  }

  changePageParams = (params) => {
    const {
      offset,
      initialPage,
    } = this.state;

    if (params.offset === offset && params.initialPage === initialPage) {
      return;
    }

    this.setState({
      offset: params.offset,
      initialPage: params.initialPage,
    });
  }

  resetSearchAndFacets = (callback) => {
    this.setState({
      searchTerm: '',
      offset: 0,
      limit: 15,
      activeFacets: {},
      initialPage: 0,
      selectedFilters: {},
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  goToMappingsPage = (e) => {
    const { history } = this.props;

    const callback = () => history.push(`${BASE_URL}/mappings`);
    this.resetSearchAndFacets(callback);
    e.preventDefault();
  }

  selectedFiltersToActiveFacets() {
    const { selectedFilters } = this.state;

    const convert = (filter, active) => {
      const values = [];
      let mainKey;

      Object.keys(filter)
        .forEach((key) => {
          const [facetKey, facetValue] = key.split(':');
          mainKey = facetKey;

          if (filter[key]) {
            values.push(facetValue);
          }
        });

      if (values.length > 0) {
        // eslint-disable-next-line no-param-reassign
        active[mainKey] = values.join(',');
      }
    };

    const activeFacets = {};

    Object.values(selectedFilters)
      .forEach(filter => convert(filter, activeFacets));

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
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
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
      title: 'Your login token is expired',
      text: <Link to={`${BASE_URL}/login`}>Click here to login again.</Link>,
    };
    return (
      <Layout {...appProps}>
        <section id="main-content-area" role="main">
          <div id="root">
            {message !== null ? <Message details={message} onClose={this.clearMessage} /> : null}
            {hasExpiredToken ? (
              <Message details={tokenIsExpiredMessage} onClose={this.clearExpiredLoginMessage} />
            ) : null}
            <Switch>
              <Route exact path={`${BASE_URL}/`} render={() => <Home {...appProps} />} />
              <Route
                exact
                path={`${BASE_URL}/mappings`}
                render={() => (
                  <Mappings {...appProps} defaultOrganism={exploreMappingsByOrganism} />
                )}
              />
              <Route exact path={`${BASE_URL}/login`} component={LoginComponent} />
              <Route exact path={`${BASE_URL}/logout`} component={LogoutComponent} />
              <Route
                path={`${BASE_URL}/mapping/:mappingId`}
                render={({ match }) => (
                  <Mapping match={match} isLoggedIn={authenticated} {...appProps} />
                )}
              />
              <Route
                path={`${BASE_URL}/unmapped/:id`}
                render={({ match }) => (
                  <Unmapped match={match} isLoggedIn={authenticated} {...appProps} />
                )}
              />
              <Route exact path={`${BASE_URL}/error`} render={() => <Broken {...appProps} />} />
              <Route exact path={`${BASE_URL}/feedback`} component={Feedback} />
              <Route exact path={`${BASE_URL}/no-results`} render={() => <NoResults {...appProps} />} />
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
