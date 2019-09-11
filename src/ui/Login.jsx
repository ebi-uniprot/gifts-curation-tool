import { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import * as jwt from 'jsonwebtoken';
import '../styles/Home.scss';

const GIFTS_DOMAIN = 'self.gifts';
const GIFTS_DOMAIN_ID = 'dom-23a4a571-5193-4cdd-838b-097ee9440e12';
const AAP_ENDPOINT_BASE = 'https://api.aai.ebi.ac.uk';
const AAP_PUBLIC_KEY = `-----BEGIN CERTIFICATE-----
MIIDYzCCAkugAwIBAgIELs3IYzANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQGEwJV
SzEQMA4GA1UECBMHRW5nbGFuZDESMBAGA1UEBxMJQ2FtYnJpZGdlMREwDwYDVQQK
EwhFTUJMLUVCSTEMMAoGA1UECxMDVFNDMQwwCgYDVQQDEwNBQVAwHhcNMTcxMDI2
MTQxNjQ1WhcNMTgwMTI0MTQxNjQ1WjBiMQswCQYDVQQGEwJVSzEQMA4GA1UECBMH
RW5nbGFuZDESMBAGA1UEBxMJQ2FtYnJpZGdlMREwDwYDVQQKEwhFTUJMLUVCSTEM
MAoGA1UECxMDVFNDMQwwCgYDVQQDEwNBQVAwggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQCJ5UQw0luRSZSBXAhAIooF0UFQCpSE0zyE81mAf51uOB18hkQK
moIfHycAZttBIkfX/ZnERmtkeEUypKy0lVNDcFZdAFRbwFCWjuRPGvWPylqRLmhj
WhUPfX3A0wHHoytVq+0yeaQTs1AhGmW3HJfw40qdtPq8K1ZSs+tbPfTgZusnPp50
o9JR/FJvB7ssVagqS0DiDwjaiMEWBUy0SfqRJyb12tX8wtwbYmS7BaHmB1fYlXqq
yoFTCMZvdGcCFtou2F10sfoKwGw/nV67EpViSDQ1REa3MISimzUtEg411k5+yUO1
7qABlzw9P31dL1L44CwrSp3jM8u/2LGwI8iRAgMBAAGjITAfMB0GA1UdDgQWBBST
2B50ZXlpshYwKHl1ugR1IdhGgDANBgkqhkiG9w0BAQsFAAOCAQEAbL+HaphJChCL
Zuft6RT3sQONx9i7bBnoz15i3I/Wo8er6ZgSuV9F5OGafV8qKqIoVycTAO5Dj5k2
wmvtdIJM0Pf0JB1IeJTnggn61Nkuoha4DuwRbEmUuujH6kuOMXyC555ZknK7ITTB
/kM3ZahmRzwvv3BzZpZ6t87M/XEWD4Vo7O8W7OF8sYKrUnGJ6/amgxme6WwYaA2g
kW1jCSBntkmh4hzRw7RKG2At4YRpUbF7wHEYmch1w5Jsna9lSrgdiNVBUeA9PRXc
Dnof5x7tPVGPQcwtA7KdEJe3dV8qxZ5mJNZt//yUgDrB9da7yRjtAR7E5FmBSnuC
FGsK9CPCSA==
-----END CERTIFICATE-----`;

class Login extends Component {
  componentDidMount() {
    window.addEventListener('message', this.onElixirResponse);
    this.windowRef = window
      .open(`${AAP_ENDPOINT_BASE}/sso?from=${AUTH_CALLBACK_URL}`, 'elixir')
      .focus();
  }

  onElixirResponse = (message) => {
    const { onLoginSuccess, onLoginFailure, cookies } = this.props;

    if (message.origin !== AAP_ENDPOINT_BASE) {
      return false;
    }

    try {
      const userToken = jwt.verify(message.data, AAP_PUBLIC_KEY, { algorithm: 'RS256'});

      cookies.set('userToken', userToken, { path: '/' });

      let readonly = true;
      const user = {
        id: userToken.sub,
        name: userToken.name,
      };

      for (let i = 0; i < userToken.domains.length; i += 1) {
        const domain = userToken.domains[i];

        if (domain === GIFTS_DOMAIN || domain === GIFTS_DOMAIN_ID) {
          readonly = false;
          onLoginSuccess(user, readonly);
          return true;
        }
      }

      return false;

    } catch(e) {
      onLoginFailure();
      return false;
    }
  };

  render = () => null;
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Login);
