import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/ReviewStatus.scss';

const ReviewStatus = (props) => {
  switch (props.entryType) {
    case 'Swiss-Prot isoform':
      return <span className="icon icon-generic protein-review-status protein-review-status--isoform-reviewed" data-icon="q" title="UniProt isoform reviewed" />;
    case 'Swiss-Prot':
      return <span className="icon icon-generic protein-review-status protein-review-status--reviewed" data-icon="q" title="UniProt reviewed" />;
    case 'TrEMBL':
      return <span className="icon icon-generic protein-review-status protein-review-status--unreviewd" data-icon="Q" title="TrEMBL unreviewed" />;
    case 'Ensembl':
      return <span className="icon icon-generic protein-review-status protein-review-status--ensembl-select" data-icon="q" title="MANE Select" />;
    default:
      // probably an isoform
      return null;
  }
};

ReviewStatus.propTypes = {
  entryType: PropTypes.string,
};

ReviewStatus.defaultProps = {
  entryType: '',
};

export default ReviewStatus;
