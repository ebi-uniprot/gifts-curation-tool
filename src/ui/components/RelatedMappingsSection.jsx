import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import ReviewStatus from "./ReviewStatus";
import StatusIcon from "./status/StatusIcon";
import AlignmentIndicator from "./alignment/AlignmentIndicator";
import Position from "./Position";

const RelatedMapping = (props) => {
  const { item } = props;
  return (
    <tr className="related-mapping">
      <td>
        <StatusIcon status={item.status} />
      </td>
      <td>
        <ReviewStatus entryType={item.uniprotEntry.entryType} />
        <a
          href={`//www.uniprot.org/uniprot/${item.uniprotEntry.uniprotAccession}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.uniprotEntry.uniprotAccession}
        </a>
      </td>
      <td>
        <a
          href={`//www.ensembl.org/id/${item.ensemblTranscript.enstId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.ensemblTranscript.enstId}
        </a>
      </td>
      <td>
        <a
          href={`//www.ensembl.org/id/${item.ensemblTranscript.ensgId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.ensemblTranscript.ensgId}
        </a>
      </td>
      <td>{item.ensemblTranscript.ensgName}</td>
      <td>{item.ensemblTranscript.source}</td>
      <td>
        <Position transcript={item.ensemblTranscript} />
      </td>
      <td>
        <AlignmentIndicator difference={item.alignment_difference} />
      </td>
      <td>
        <Link
          to={`${process.env.REACT_APP_BASE_URL}/mapping/${item.mappingId}`}
        >
          <span>View</span>
        </Link>
      </td>
    </tr>
  );
};

RelatedMapping.propTypes = {
  item: PropTypes.shape({
    mappingId: PropTypes.number,
    status: PropTypes.string,
    uniprotEntry: PropTypes.object,
    ensemblTranscript: PropTypes.object,
    alignment_difference: PropTypes.number,
  }).isRequired,
};

const UnmappedEnsembl = (props) => {
  const { item } = props;
  const {
    enstId,
    ensgId,
    ensgName,
    source,
    chromosome,
    seqRegionStart,
    seqRegionEnd,
  } = item;

  return (
    <tr className="related-mapping">
      <td />
      <td />
      <td>{enstId}</td>
      <td>{ensgId}</td>
      <td>{ensgName}</td>
      <td>{source}</td>
      <td>
        <Position transcript={{ chromosome, seqRegionStart, seqRegionEnd }} />
      </td>
      <td />
      <td />
    </tr>
  );
};

UnmappedEnsembl.propTypes = {
  item: PropTypes.shape({
    enstId: PropTypes.string,
    ensgId: PropTypes.string,
    ensgName: PropTypes.string,
    source: PropTypes.string,
    chromosome: PropTypes.string,
    seqRegionStart: PropTypes.number,
    seqRegionEnd: PropTypes.number,
  }).isRequired,
};

const UnmappedUniProt = (props) => {
  const { item } = props;

  return (
    <tr className="related-mapping">
      <td />
      <td>
        <a
          href={`//www.uniprot.org/uniprot/${item.uniprotAccession}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <ReviewStatus entryType={item.entryType} />
            {item.uniprotAccession}
          </span>
        </a>
      </td>
      <td />
      <td>{item.gene_accession}</td>
      <td>{item.gene_symbol}</td>
      <td />
      <td />
      <td />
    </tr>
  );
};

UnmappedUniProt.propTypes = {
  item: PropTypes.shape({
    uniprotAccession: PropTypes.string,
    entryType: PropTypes.string,
    gene_accession: PropTypes.string,
    gene_symbol: PropTypes.string,
  }).isRequired,
};

const RelatedMappingsSection = (props) => {
  const { mappings } = props;

  return (
    <table className="related-mappings">
      <thead>
        <tr>
          <th />
          <th>Protein</th>
          <th>Transcript</th>
          <th>Gene ID</th>
          <th>Gene Name</th>
          <th>Source</th>
          <th>Position</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {mappings.mapped.map((item) =>
          item ? <RelatedMapping item={item} key={item.mappingId} /> : null
        )}
        {mappings.unmapped.ensembl.map((item) =>
          item ? (
            <UnmappedEnsembl
              item={item}
              key={`${item.enstId}-${item.ensgId}`}
            />
          ) : null
        )}
        {mappings.unmapped.uniprot.map((item) =>
          item ? (
            <UnmappedUniProt
              item={item}
              key={`${item.gene_symbol}-${item.uniprotAccession}`}
            />
          ) : null
        )}
      </tbody>
    </table>
  );
};

RelatedMappingsSection.propTypes = {
  mappings: PropTypes.shape({
    mapped: PropTypes.array,
    unmapped: PropTypes.object,
  }).isRequired,
};

export default RelatedMappingsSection;
