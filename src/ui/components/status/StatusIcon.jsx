import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/StatusIcon.scss';

function getClassName(status) {
  switch (status) {
    case 'UNDER_REVIEW':
      return 'status status--under-review';
    case 'REVIEWED':
      return 'status status--reviewed';
    case 'REJECTED':
      return 'status status--rejected';
    case 'UNIPROT_REVIEW':
      return 'status status--uniprot';
    case 'ENSEMBL_REVIEW':
      return 'status status--ensembl';
    case 'REFSEQ_REVIEW':
      return 'status status--refseq';
    case 'HGNC_REVIEW':
      return 'status status--hgnc';
    default:
      return 'status status--unreviewed';
  }
}

const StatusIcon = ({ status }) => <div className={getClassName(status)} />;

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusIcon;
