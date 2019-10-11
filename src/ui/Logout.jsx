import { Component } from 'react';
import PropTypes from 'prop-types';

import { withCookies } from 'react-cookie';

import '../styles/Home.scss';

class Logout extends Component {
  constructor(props) {
    super(props);
    const { onLogout, cookies } = props;

    cookies.remove('userToken', { path: '/' });
    onLogout();
  }

  render = () => null;
}

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Logout);
