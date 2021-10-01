import React from "react";
import { withRouter } from "react-router-dom";

import "../../../styles/Statistics.scss";
import StatsContainer from "./StatsContainer";

const Statistics = ({ species }) => (
  <div className="row">
    <div className="column medium-2">
      <h2>About</h2>
      <p>
        This project aims to provide a common framework for Ensembl and UniProt
        data. This infrastructure will enable both teams to read and comment on
        data, track entities between resources and support mappings between
        entities.
      </p>
      <p>
        <a
          href="https://www.ebi.ac.uk/data-protection/privacy-notice/gifts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Notice for GIFTS Collaborative Annotation Portal
        </a>
      </p>
    </div>
    <div className="column medium-10">
      {species.map((specie) => (
        <div className="row" key={specie.taxId}>
          <h2 className="column medium-12">
            <span className="icon icon-species" data-icon={specie.icon} />
            {specie.name}
          </h2>
          <StatsContainer taxId={specie.taxId} />
        </div>
      ))}
    </div>
  </div>
);

export default withRouter(Statistics);
