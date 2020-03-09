import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import LoadingSpinner from './components/LoadingSpinner';
import ResultsTable from './components/ResultsTable';

import '../styles/Home.scss';

let isLoading = true;

class Mappings extends Component {
  state = {
    results: null,
    facets: {},
  }

  componentDidMount() {
    this.loadResults();
  }

  componentDidUpdate(prevProps) {
    const { results } = this.state;
    const {
      activeFacets,
      searchTerm,
    } = this.props;

    if (
      isLoading
      || results === null
      || !isEqual(prevProps.activeFacets, activeFacets)
      || prevProps.searchTerm !== searchTerm
    ) {
      this.loadResults();
    }
  }

  getFacetsAsString = () => {
    const { activeFacets } = this.props;
    return Object.keys(activeFacets || {})
      .map(key => `${key}:${activeFacets[key]}`)
      .join(';');
  }

  handlePageClick = (data) => {
    const {
      initialPage,
      limit,
      offset,
      changePageParams,
    } = this.props;
    const newInitialPage = data.selected;
    const newOffset = Math.ceil(initialPage * limit);

    if (newOffset === offset && newInitialPage === initialPage) {
      return;
    }

    this.setState({
      results: null,
    });

    changePageParams({
      offset: newOffset,
      initialPage: newInitialPage,
    });
  };

  loadResults = () => {
    isLoading = true;
    const {
      searchTerm,
      history,
      clearSearchTerm,
      offset,
      limit,
    } = this.props;
    const apiURI = `${API_URL}/mappings`;
    const params = {
      searchTerm,
      offset,
      limit,
      format: 'json',
      facets: this.getFacetsAsString(),
    };

    axios
      .get(apiURI, { params })
      .then(({ data, status }) => {
        if (status === 204) {
          clearSearchTerm(() => {
            history.push(`${BASE_URL}/no-results`);
          });

          return;
        }

        // const onlyIsoforms = data.results.every(d =>
        //   d.entryMappings.every(mapping => !mapping.uniprotEntry.isCanonical));

        const groupedResults = this.groupByIsoform(data.results);

        this.setState({
          // params: this.props.params,
          facets: data.facets,
          results: groupedResults,
          totalCount: data.count,
          // displayIsoforms: onlyIsoforms,
        }, () => {
          isLoading = false;
        });
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  groupByIsoform = results => results
    .map((group, index) => ({
      taxonomy: group.taxonomy,
      rows: group.entryMappings,
      wrapper: {
        index,
        ensgId: group.entryMappings[0].ensemblTranscript.ensgId,
        gene_symbol: group.entryMappings[0].uniprotEntry.gene_symbol,
        counts: {
          canonical: group.entryMappings
            .filter(mapping => mapping.uniprotEntry.isCanonical === true)
            .length,
          isoform: group.entryMappings
            .filter(mapping => mapping.uniprotEntry.isCanonical === false)
            .length,
        },
      },
    }));

  render() {
    const {
      offset,
      limit,
      facets,
      results,
      totalCount,
    } = this.state;

    const {
      activeFacets,
      history,
      initialPage,
      clearSearchTerm,
      selectedFilters,
      toggleFilter,
    } = this.props;

    const propsToPass = {
      handlePageClick: this.handlePageClick,
      activeFacets,
      params: {
        offset,
        limit,
        format: 'json',
      },
      facets,
      results,
      loadResults: this.loadResults,
      // eslint-disable-next-line react/destructuring-assignment
      pageCount: Math.ceil(totalCount / this.props.limit),
      history,
      initialPage,
      clearSearchTerm,
      selectedFilters,
      toggleFilter,
      rowCount: totalCount,
    };

    return (isLoading || results === null)
      ? <LoadingSpinner />
      : <ResultsTable {...propsToPass} />;
  }
}

Mappings.propTypes = {
  searchTerm: PropTypes.string,
  defaultOrganism: PropTypes.number,
  history: PropTypes.shape({}).isRequired,
  clearSearchTerm: PropTypes.func,
  initialPage: PropTypes.number,
  limit: PropTypes.number,
  offset: PropTypes.number,
  changePageParams: PropTypes.func,
  activeFacets: PropTypes.shape({}),
  params: PropTypes.shape({}),
  selectedFilters: PropTypes.shape({}),
  toggleFilter: PropTypes.func,
};

Mappings.defaultProps = {
  searchTerm: '',
  defaultOrganism: null,
  clearSearchTerm: null,
  initialPage: 0,
  limit: 15,
  offset: 0,
  changePageParams: null,
  activeFacets: {},
  params: {},
  selectedFilters: {},
  toggleFilter: () => {},
};

export default withRouter(Mappings);
