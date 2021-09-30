import React from "react";
import PropTypes from "prop-types";

const NoResults = (props) => (
  <div className="row column medium-8 medium-offset-2">
    <div className="callout text-center">
      <h2>No results!</h2>
      <span role="img" className="h1" aria-label="Half-empty glass">
        🥛
      </span>
      <p className="lead">You could try a different search term or</p>
      <a
        href={`${process.env.REACT_APP_BASE_URL}/mappings`}
        onClick={(e) => props.goToMappingsPage(e)}
        className="button"
      >
        Explore mappings
      </a>
    </div>
  </div>
);

NoResults.propTypes = {
  goToMappingsPage: PropTypes.func.isRequired,
};

export default NoResults;
