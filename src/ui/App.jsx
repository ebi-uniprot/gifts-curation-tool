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

import '../styles/Gifts.scss';

class App extends Component {
  defaultState = {
    // eslint-disable-next-line react/destructuring-assignment
    searchTerm: queryString.parse(this.props.location.search).searchTerm
      // eslint-disable-next-line react/destructuring-assignment
      ? queryString.parse(this.props.location.search).searchTerm
      : '',
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
    message: null,
    validToken: null,
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
    const { cookies } = this.props;
    this.setState({
      authenticated: cookies.get('authenticated') === '1',
      jwt: cookies.get('jwt') || '',
    });
  }

  onLoginFailure = () => {
    this.setState(this.defaultState);
  };

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

  onLoginSuccess = (user, readonly) => {
    const { history, cookies } = this.props;

    this.setState(
      {
        authenticated: true,
        validToken: true,
        readonly,
        user,
      },
      () => {
        history.push(`${BASE_URL}/`);
        cookies.set('authenticated', '1', { path: '/' });
      },
    );
  };

  clearMessage = () => this.setState({ message: null });

  tokenIsExpired = () => {
    this.setState({
      validToken: false,
      authenticated: false,
      readonly: true,
      user: {
        id: 'guest',
        name: 'Guest',
      },
    });
  };

  clearExpiredLoginMessage = () => {
    const { cookies } = this.props;

    this.setState({
      validToken: true,
    });

    cookies.remove('jwt', { path: '/' });
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
      authenticated, message, validToken, exploreMappingsByOrganism,
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
            {validToken === false ? (
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
