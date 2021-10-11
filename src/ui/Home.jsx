import React from "react";
import PropTypes from "prop-types";

import SearchField from "./components/SearchField";
import Statistics from "./components/stats/Statistics";

import "../styles/Home.scss";

export const species = [
  {
    name: "Human",
    taxId: 9606,
    icon: "H",
  },
  {
    name: "Mouse",
    taxId: 10090,
    icon: "M",
  },
  {
    name: "Rat",
    taxId: 10116,
    icon: "R",
  },
  {
    name: "Zebrafish",
    taxId: 7955,
    icon: "Z",
  },
  {
    name: "Zea mays",
    taxId: 4577,
    icon: "c",
  },
  {
    name: "Glycine max",
    taxId: 3847,
    icon: "^",
  },
];

const Home = (props) => (
  <main>
    <div className="home-banner">
      <div className="column medium-offset-3 medium-6 text-center">
        <h5>Search for a mapping:</h5>
        <SearchField {...props} />
        <div className="home-banner__actions">
          Explore:{" "}
          {species.map((specie) => (
            <button
              type="button"
              className="button"
              onClick={() => props.exploreMappingsByOrganism(specie.taxId)}
              title={specie.name}
              key={specie.taxId}
            >
              <span className="icon icon-species" data-icon={specie.icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
    <Statistics species={species} />
  </main>
);

Home.propTypes = {
  exploreMappingsByOrganism: PropTypes.func.isRequired,
};

export default Home;
