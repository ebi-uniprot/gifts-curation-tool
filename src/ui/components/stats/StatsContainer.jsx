import axios from "axios";
import React, { useEffect, useState } from "react";
import EnsemblStats from "./EnsemblStats";
import UniProtStats from "./UniProtStats";

const StatsContainer = ({ taxId }) => {
  const [stats, setStats] = useState();
  const [rel, setRel] = useState();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/mappings/stats/${taxId}/?format=json`
      )
      .then((response) => setStats(response.data));
  }, [taxId]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/mappings/release/${taxId}/?format=json`
      )
      .then((response) => setRel(response.data));
  }, [taxId]);

  if (!stats) {
    return null;
  }
  return (
    <>
      <UniProtStats {...stats} {...rel} />
      <EnsemblStats {...stats} {...rel} />
    </>
  );
};

export default StatsContainer;
