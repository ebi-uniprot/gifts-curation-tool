import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import SearchField from "./SearchField";

function Header(props) {
  const { authenticated, location, goToMappingsPage } = props;

  const loginLogoutLink = authenticated ? (
    <li>
      <Link to={`${process.env.REACT_APP_BASE_URL}/logout`}>Logout</Link>
    </li>
  ) : (
    <li>
      <Link to={`${process.env.REACT_APP_BASE_URL}/login`}>Login</Link>
    </li>
  );

  return (
    <div data-sticky-container>
      <header
        id="masthead"
        className="masthead"
        data-sticky
        data-sticky-on="large"
        data-top-anchor="content:top"
        data-btm-anchor="content:bottom"
      >
        <div className="masthead-inner row">
          {/* <!-- local-title --> */}
          <div className="columns medium-6" id="local-title">
            <h1>
              <Link
                to={`${process.env.REACT_APP_BASE_URL}/`}
                title="Back to GIFTs homepage"
              >
                GIFTS
              </Link>
            </h1>
          </div>
          {/* <!-- /local-title --> */}
          {/* <!-- local-nav --> */}
          <div className="columns medium-6">
            {location.pathname !== `${process.env.REACT_APP_BASE_URL}/` && (
              <SearchField {...props} />
            )}
          </div>
          <nav>
            <ul
              id="local-nav"
              className="dropdown menu float-left"
              data-description="navigational"
            >
              <li>
                <Link to={`${process.env.REACT_APP_BASE_URL}/`}>Home</Link>
              </li>
              <li>
                <a
                  href={`${process.env.REACT_APP_BASE_URL}/mappings`}
                  onClick={(e) => goToMappingsPage(e)}
                >
                  Mappings
                </a>
              </li>
              <li>
                 <a
                  href={`${process.env.REACT_APP_API_URL}/docs/`} target="_blank"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link to={`${process.env.REACT_APP_BASE_URL}/feedback`}>
                  Feedback
                </Link>
              </li>
              {!process.env.REACT_APP_READ_ONLY && loginLogoutLink}
            </ul>
          </nav>
          {/* <!-- /local-nav --> */}
        </div>
      </header>
    </div>
  );
}

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  goToMappingsPage: PropTypes.func.isRequired,
};

export default withRouter(Header);
