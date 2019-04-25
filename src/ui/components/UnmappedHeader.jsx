import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ReviewStatus from './ReviewStatus';

import '../../styles/UnmappedHeader.scss';

const UnmappedHeader = (props) => {
  const { unmapped } = props;
  const { entry, relatedEntries } = unmapped;

  const proteinExistenceValues = {
    1: 'Evidence at protein level',
    2: 'Evidence at transcript level',
    3: 'Inferred from homology',
    4: 'Predicted',
    5: 'Uncertain',
  };

  return (
    <div className="unmapped-header">
      <div>
        <h2>
          <Link
            to={`//www.uniprot.org/uniprot/${entry.uniprot_acc}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReviewStatus entryType={entry.entryType} />
            {entry.uniprot_acc}
          </Link>
        </h2>
        <div>
          <strong>UniProt Gene Symbol:</strong>
          &nbsp;
          {entry.gene_symbol_up}
        </div>
        <div>
          <strong>Release:</strong>
          &nbsp;
          {entry.release_version}
        </div>
        <div>
          <strong>Length:</strong>
          &nbsp;
          {entry.length}
        </div>
        <div>
          <strong>UniProt Tax. ID.:</strong>
          &nbsp;
          {entry.uniprot_tax_id}
        </div>
        <div>
          <strong>Ensembl derived:</strong>
          &nbsp;
          {entry.ensembl_derived ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Protein existence:</strong>
          &nbsp;
          {proteinExistenceValues[entry.protein_existence_id]}
        </div>
      </div>
    </div>
  );
};

UnmappedHeader.propTypes = {
  unmapped: PropTypes.shape({}).isRequired,
};

export default UnmappedHeader;
