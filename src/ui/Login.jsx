import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import axios from "axios";
import "../styles/Home.scss";
import {Link} from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.emailField = React.createRef();
    this.passwordField = React.createRef();

    this.state = {
      emailError: null,
      passwordError: null,
      generalError: null,
    };
  }

  handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { onLoginSuccess, onLoginFailure, cookies } = this.props;

    // Reset errors
    this.setState({
      emailError: null,
      passwordError: null,
      generalError: null,
    });

    const email = this.emailField.current.value;
    const password = this.passwordField.current.value;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login/`,
        { email, password }
      );

      const { access_token, user } = response.data;

      // Save token in cookies
      const maxAge = 86400; // Example: 1 day
      cookies.set("userToken", access_token, { path: "/", maxAge });

      // Pass user data to the parent component
      onLoginSuccess(user);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          // Handle unauthorized error
          this.setState({
            generalError: data.error || "Invalid credentials. Please try again.",
          });
        } else if (status === 400) {
          // Handle validation errors (if any)
          if (data.email) {
            this.setState({ emailError: data.email.join(" ") });
          }
          if (data.password) {
            this.setState({ passwordError: data.password.join(" ") });
          }
        } else {
          // Handle unexpected errors
          this.setState({
            generalError: "An unexpected error occurred. Please try again later.",
          });
        }
      } else {
        console.error("Unexpected error: ", error);
        this.setState({
          generalError: "Unable to connect to the server. Please try again later.",
        });
      }

      // onLoginFailure();
    }
  };


  render() {
    const { emailError, passwordError, generalError } = this.state;

    return (
      <Fragment>
        <div className="medium-offset-4 medium-4 text-center">
          <h5>Log In</h5>
          <br />
          <form onSubmit={this.handleLoginSubmit} className="login-form">
            {generalError && (
                <div
                    className="error-message"
                    style={{
                      color: "red",
                      fontSize: "larger",
                      fontWeight: "bold"
                    }}
                >
                  {generalError}
                </div>
            )}
            <div className="input-group">
              <input
                  type="text"
                  placeholder="Email"
                  className={`input-group-field ${
                      emailError ? "input-error" : ""
                  }`}
                  ref={this.emailField}
                  required
              />
              {emailError &&
                  <div
                      style={{
                        color: "red",
                        fontSize: "larger",
                        fontWeight: "bold"
                      }}
                  >
                    {emailError}
                  </div>
              }
            </div>
            <div className="input-group">
              <input
                  type="password"
                  placeholder="Password"
                  className={`input-group-field ${
                      passwordError ? "input-error" : ""
                  }`}
                  ref={this.passwordField}
                  required
              />
              {passwordError && (
                <div
                    style={{
                      color: "red",
                      fontSize: "larger",
                      fontWeight: "bold"
                    }}
                >
                  {passwordError}
                </div>
              )}
            </div>
            <Link to={`${process.env.REACT_APP_BASE_URL}/change-password`} className="change-password-link">
            Click Here if you want to change your password
            </Link>
            <br/><br/>
            <button type="submit" className="button">
              Login
            </button>
          </form>
        </div>
      </Fragment>
    );
  }
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Login);
