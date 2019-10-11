import { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import * as jwt from 'jsonwebtoken';

import { getSecondsSinceEpoch } from './util/util';
import authConfig from '../authConfig';
import '../styles/Home.scss';

class Login extends Component {
  componentDidMount() {
    window.addEventListener('message', this.onElixirResponse);
    this.windowRef = window
      .open(`${authConfig.aap.url}/sso?from=${AUTH_CALLBACK_URL}`, 'elixir')
      .focus();
  }

  onElixirResponse = (message) => {
    const { onLoginSuccess, onLoginFailure, cookies } = this.props;

    if (message.origin !== authConfig.aap.url) {
      return false;
    }

    try {
      const userToken = jwt.verify(
        message.data,
        authConfig.aap.public_key,
        { algorithm: authConfig.aap.algorithm },
      );

      for (let i = 0; i < userToken.domains.length; i += 1) {
        const domain = userToken.domains[i];

        if ([authConfig.gifts.domain.name, authConfig.gifts.domain.id].includes(domain)) {
          const user = {
            id: userToken.sub,
            name: userToken.name,
          };

          onLoginSuccess(user);
          const maxAge = userToken.exp - getSecondsSinceEpoch();

          cookies.set('userToken', message.data, { path: '/', maxAge });
          return true;
        }
      }

      return false;
    } catch (e) {
      onLoginFailure();
      return false;
    }
  };

  render = () => null;
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Login);
