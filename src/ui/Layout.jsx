import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import ClosableBanner from "./components/ClosableBanner";

const Layout = (props) => {
  const { children, frontendVersion, backendVersion } = props;

  return (
    <div id="content">
      <div id="modal" />
      <Header {...props} />
      {/* <!-- Suggested layout containers --> */}
      <section id="main-content-area" role="main">
        <div id="root">
          {/* <!-- App content --> */}
          {children}
        </div>
      </section>
      <div className="footer-versions">
        <span>
          {`Front-end v${frontendVersion} - Back-end v${backendVersion}`}
        </span>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  frontendVersion: PropTypes.string.isRequired,
  backendVersion: PropTypes.string,
};

Layout.defaultProps = {
  backendVersion: '',
};

export default Layout;
