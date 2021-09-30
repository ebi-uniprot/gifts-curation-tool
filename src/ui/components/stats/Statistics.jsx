import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import UniProtStats from "./UniProtStats";
import EnsemblStats from "./EnsemblStats";
import LoadingSpinner from "../LoadingSpinner";

import "../../../styles/Statistics.scss";

const mouseTaxid = "10090";
const humanTaxid = "9606";
const zeaMaysTaxid = "4577";
const ratusNorvegicusTaxid = "10116";
const glycineMaxTaxid = "3847";
const zebrafishTaxid = "7955";

class Statistics extends Component {
  state = {
    stats: null,
  };

  componentDidMount() {
    this.getStats();
  }

  getStats = () => {
    const { history } = this.props;
    const promises = [];
    promises.push(
      axios.get(
        `${process.env.REACT_APP_API_URL}/mappings/stats/${humanTaxid}/?format=json`
      )
    );
    promises.push(
      axios.get(
        `${process.env.REACT_APP_API_URL}/mappings/stats/${mouseTaxid}/?format=json`
      )
    );
    promises.push(
      axios.get(
        `${process.env.REACT_APP_API_URL}/mappings/release/${humanTaxid}/?format=json`
      )
    );
    promises.push(
      axios.get(
        `${process.env.REACT_APP_API_URL}/mappings/release/${mouseTaxid}/?format=json`
      )
    );
    axios
      .all(promises)
      .then((response) => {
        this.setState({
          stats: {
            human: response[0].data,
            mouse: response[1].data,
            humanRel: response[2].data,
            mouseRel: response[3].data,
          },
        });
      })
      .catch((e) => {
        console.log(e);
        history.push(`${process.env.REACT_APP_BASE_URL}/error`);
      });
  };

  render() {
    const { stats } = this.state;

    if (stats <= 0) {
      return <LoadingSpinner />;
    }

    return (
      <Fragment>
        <div className="row">
          <div className="column medium-2">
            <h2>About</h2>
            <p>
              This project aims to provide a common framework for Ensembl and
              UniProt data. This infrastructure will enable both teams to read
              and comment on data, track entities between resources and support
              mappings between entities.
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
            <div className="row">
              <h2 className="column medium-12">
                Human
                <span className="icon icon-species" data-icon="H" />
              </h2>
              <UniProtStats {...stats.human} {...stats.humanRel} />
              <EnsemblStats {...stats.human} {...stats.humanRel} />
            </div>
            <div className="row">
              <h2 className="column medium-12">
                Mouse
                <span className="icon icon-species" data-icon="M" />
              </h2>
              <UniProtStats {...stats.mouse} {...stats.mouseRel} />
              <EnsemblStats {...stats.mouse} {...stats.mouseRel} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

Statistics.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default withRouter(Statistics);
