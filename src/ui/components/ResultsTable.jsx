import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import isEqual from 'lodash-es/isEqual';

import StatusIndicator from './StatusIndicator';
import Filters from './Filters';
import ReviewStatus from './ReviewStatus';
import AlignmentIndicator from './alignment/AlignmentIndicator';
import Position from './Position';
import { formatLargeNumber } from '../util/util';

import '../../styles/ResultsTable.scss';

class ResultsTable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.params, prevState.params)) {
      return {
        params: nextProps.params,
      };
    }
    return null;
  }

  state = {
    displayIsoforms: true,
    expandGroupIndex: null,
  };

  toggleShowIsoforms = () => {
    const { displayIsoforms } = this.state;

    this.setState({
      displayIsoforms: !displayIsoforms,
      expandGroupIndex: null,
    });
  };

  toggleExpandGroup = (index) => {
    const { expandGroupIndex } = this.state;

    this.setState({
      expandGroupIndex: (index !== expandGroupIndex)
        ? index
        : null,
    });
  }

  renderRows = (group) => {
    const {
      displayIsoforms,
      expandGroupIndex,
    } = this.state;
    const { rows, taxonomy, wrapper } = group;

    rows
      .sort((a, b) => {
        if (a.uniprotEntry.isCanonical && !b.uniprotEntry.isCanonical) {
          return 1;
        }

        if (!a.uniprotEntry.isCanonical && b.uniprotEntry.isCanonical) {
          return -1;
        }

        if (a.alignment_difference === null && b.alignment_difference !== null) {
          return -1;
        }

        if (b.alignment_difference === null) {
          return 0;
        }

        return (a.alignment_difference - b.alignment_difference);
      });

    return rows.map((mapping) => {
      const key = `${mapping.ensemblTranscript.enstId}_${mapping.uniprotEntry.uniprotAccession}`;

      if (!displayIsoforms
        && (!mapping.uniprotEntry.isCanonical
          && (mapping.uniprotEntry.entryType === 'TrEMBL'
            || mapping.uniprotEntry.entryType === 'Swiss-Prot isoform'
          )
        )
        && wrapper.index !== expandGroupIndex
      ) {
        return null;
      }

      const detailsPageLink = (mapping.mappingId)
        ? `${BASE_URL}/mapping/${mapping.mappingId}`
        : `${BASE_URL}/unmapped/${mapping.id}`;

      return (
        <Link to={detailsPageLink} key={key} className="table-row">
          <div className="table-cell">
            {(mapping.uniprotEntry.isCanonical)
              && (
                <span
                  className="protein-type-icon protein-type-icon--canonical"
                  title="Canonical"
                >
                  can
                </span>
              )
            }
            {((mapping.uniprotEntry.entryType === 'TrEMBL'
              || mapping.uniprotEntry.entryType === 'Swiss-Prot isoform'
            )
              && !mapping.uniprotEntry.isCanonical)
              && (
                <span
                  className="protein-type-icon protein-type-icon--isoform"
                  title="Isoform"
                >
                  iso
                </span>
              )
            }
          </div>
          <div className="table-cell">
            <StatusIndicator status={mapping.status} />
          </div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgSymbol}</div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgId}</div>
          <div className="table-cell">
            <Position transcript={mapping.ensemblTranscript} />
          </div>
          <div className="table-cell">
            <strong>
              <ReviewStatus entryType={mapping.ensemblTranscript.select ? 'Ensembl' : ''} />
              {mapping.ensemblTranscript.enstId}
            </strong>
          </div>
          <div className="table-cell">
            <strong>
              <ReviewStatus entryType={mapping.uniprotEntry.entryType} />
              {mapping.uniprotEntry.uniprotAccession}
            </strong>
          </div>
          <div className="table-cell">{mapping.uniprotEntry.length}</div>
          <div className="table-cell">{taxonomy.species}</div>
          <div className="table-cell">
            <AlignmentIndicator difference={mapping.alignment_difference} />
          </div>
        </Link>
      );
    });
  };

  renderBorderWrapperRows = (group) => {
    const { wrapper } = group;
    const {
      index,
      gene_symbol,
    } = wrapper;

    return (
      <div className="table-body group-wrapper" key={`${index}-${gene_symbol}`}>
        {this.renderRows(group)}
      </div>
    );
  };

  render() {
    const {
      displayIsoforms,
    } = this.state;
    const {
      rowCount: rowCountUnformatted,
      facets,
      activeFacets,
      selectedFilters,
      toggleFilter,
      results,
      pageCount,
      handlePageClick,
      initialPage,
    } = this.props;
    const rowCount = formatLargeNumber(rowCountUnformatted);

    return (
      <Fragment>
        <div className="row column medium-12">
          <h2>{`${rowCount} ${(rowCount === '1') ? 'Mapping' : 'Mappings'}`}</h2>
        </div>
        <div className="row">
          <div className="column medium-2">
            <Filters
              data={facets}
              activeFacets={activeFacets}
              selectedFilters={selectedFilters}
              toggleFilter={toggleFilter}
            />
          </div>
          <div className="column medium-10">
            {
              <button type="button" className="button" onClick={() => this.toggleShowIsoforms()}>
                {displayIsoforms ? 'Hide ' : 'Show '}
                Isoforms
              </button>
            }
            <div className="table tbody-zebra">
              <div className="table-head">
                <div className="table-row">
                  <div className="table-cell" />
                  <div className="table-cell" />
                  <div className="table-cell">Gene symbol</div>
                  <div className="table-cell">Gene ID</div>
                  <div className="table-cell">Position</div>
                  <div className="table-cell">Transcript</div>
                  <div className="table-cell">Protein</div>
                  <div className="table-cell">Length</div>
                  <div className="table-cell">Organism</div>
                  <div className="table-cell">&nbsp;</div>
                </div>
              </div>

              {results && results
                .map(group => this.renderBorderWrapperRows(group))}

            </div>
            <ReactPaginate
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              initialPage={initialPage}
              containerClassName="results-paginate"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

ResultsTable.propTypes = {
  activeFacets: PropTypes.shape({}).isRequired,
  handlePageClick: PropTypes.func.isRequired,
  initialPage: PropTypes.number.isRequired,
  facets: PropTypes.arrayOf(PropTypes.shape({})),
  results: PropTypes.arrayOf(PropTypes.shape({})),
  pageCount: PropTypes.number,
  rowCount: PropTypes.number,
  selectedFilters: PropTypes.shape({}).isRequired,
  toggleFilter: PropTypes.func.isRequired,
};

ResultsTable.defaultProps = {
  facets: [],
  results: [],
  pageCount: 0,
  rowCount: 0,
};

export default ResultsTable;
