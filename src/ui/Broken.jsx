import React from "react";
import { Link } from "react-router-dom";

const Broken = () => (
  <div className="row column medium-8 medium-offset-2">
    <div className="callout text-center alert">
      <h2>Oh no, something is not right!</h2>
      <span role="img" className="h1" aria-label="Broken heart">
        💔
      </span>
      <p>
        We are probably already working hard on solving this issue, but just in
        case you could always submit a bug using Feedback form....
      </p>
      <Link to={`${process.env.REACT_APP_BASE_URL}/`} className="button">
        Go back
      </Link>
    </div>
  </div>
);

export default Broken;
