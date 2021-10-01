import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Arrow from "./Arrow";
import ReviewStatus from "./ReviewStatus";
import Position from "./Position";

import "../../styles/MappingHeader.scss";

const MappingHeader = (props) => {
  const { mapping, taxonomy } = props;

  const proteinExistenceValues = {
    1: "Evidence at protein level",
    2: "Evidence at transcript level",
    3: "Inferred from homology",
    4: "Predicted",
    5: "Uncertain",
  };

  const ensemblUrl =
    taxonomy.ensemblTaxId === 4577 || taxonomy.ensemblTaxId === 3847
      ? `//www.ensemblgenomes.org/id/${mapping.ensemblTranscript.enstId}`
      : `//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`;

  return (
    <div className="mapping-header">
      <div className="mapping-ids">
        <h2>
          <Link to={ensemblUrl} target="_blank" rel="noopener noreferrer">
            <ReviewStatus
              entryType={mapping.ensemblTranscript.select ? "Ensembl" : ""}
            />
            {mapping.ensemblTranscript.enstId}
            {mapping.ensemblTranscript.enstVersion
              ? `.${mapping.ensemblTranscript.enstVersion}`
              : ""}
          </Link>
        </h2>
        <div>
          <strong>Release:</strong>
          &nbsp;
          {mapping.ensemblRelease}
        </div>
        <div>
          <strong>MANE Select:</strong>
          &nbsp;
          {mapping.ensemblTranscript.select ? "Yes" : "No"}
        </div>
        <div>
          <strong>Symbol:</strong>
          &nbsp;
          {mapping.ensemblTranscript.ensgSymbol}
        </div>
        <div>
          <strong>Gene Id:</strong>
          &nbsp;
          <Link
            to={`//www.ensembl.org/id/${mapping.ensemblTranscript.ensgId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {mapping.ensemblTranscript.ensgId}
          </Link>
        </div>
        <div>
          <strong>Description:</strong>
          &nbsp;
          {mapping.ensemblTranscript.ensgName}
        </div>
        <div>
          <strong>Position:</strong>
          &nbsp;
          <Position transcript={mapping.ensemblTranscript} />
        </div>
        <div>
          <strong>Biotype:</strong>
          &nbsp;
          {mapping.ensemblTranscript.biotype}
        </div>
        <div>
          <strong>Region:</strong>
          &nbsp;
          {mapping.ensemblTranscript.regionAccession}
        </div>
        <div>
          <strong>Source:</strong>
          &nbsp;
          {mapping.ensemblTranscript.source}
        </div>
      </div>
      <Arrow />
      <div className="mapping-ids">
        <h2>
          <Link
            to={`//www.uniprot.org/uniprot/${mapping.uniprotEntry.uniprotAccession}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReviewStatus entryType={mapping.uniprotEntry.entryType} />
            {mapping.uniprotEntry.uniprotAccession}
          </Link>
        </h2>
        <div>
          <strong>Release:</strong>
          &nbsp;
          {mapping.uniprotRelease}
        </div>
        <div>
          <strong>Canonical:</strong>
          &nbsp;
          {mapping.uniprotEntry.isCanonical ? "Yes" : "No"}
        </div>
        <div>
          <strong>Length:</strong>
          &nbsp;
          {mapping.uniprotEntry.length}
        </div>
        <div>
          <strong>Ensembl derived:</strong>
          &nbsp;
          {mapping.uniprotEntry.ensemblDerived ? "Yes" : "No"}
        </div>
        <div>
          <strong>Protein existence:</strong>
          &nbsp;
          {proteinExistenceValues[mapping.uniprotEntry.protein_existence_id]}
        </div>
      </div>
    </div>
  );
};

MappingHeader.propTypes = {
  mapping: PropTypes.shape({}).isRequired,
};

export default MappingHeader;
