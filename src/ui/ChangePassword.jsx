import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles/Home.scss";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.emailField = React.createRef();
    this.oldPasswordField = React.createRef();
    this.newPasswordField = React.createRef();
    this.confirmNewPasswordField = React.createRef();

    this.state = {
      emailError: null,
      oldPasswordError: null,
      newPasswordError: null,
      confirmNewPasswordError: null,
      generalError: null,
      successMessage: null,
    };
  }

  handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and messages
    this.setState({
      emailError: null,
      oldPasswordError: null,
      newPasswordError: null,
      confirmNewPasswordError: null,
      generalError: null,
      successMessage: null,
    });

    const email = this.emailField.current.value;
    const oldPassword = this.oldPasswordField.current.value;
    const newPassword = this.newPasswordField.current.value;
    const confirmNewPassword = this.confirmNewPasswordField.current.value;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/change_password/`,
        {
          email,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }
      );

      this.setState({
        successMessage: response.data.message,
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          // Handle unauthorized error
          this.setState({
            generalError: data.error || "Invalid credentials. Please try again.",
          });
        } else if (status === 400) {
          if (data.email) {
            this.setState({ emailError: data.email.join(" ") });
          }
          if (data.old_password) {
            this.setState({ oldPasswordError: data.old_password.join(" ") });
          }
          if (data.new_password) {
            this.setState({ newPasswordError: data.new_password.join(" ") });
          }
          if (data.confirm_new_password) {
            this.setState({ confirmNewPasswordError: data.confirm_new_password.join(" ") });
          }
        } else {
          this.setState({
            generalError: "An unexpected error occurred. Please try again later.",
          });
        }
      } else {
        this.setState({
          generalError: "Unable to connect to the server. Please try again later.",
        });
      }
    }
  };

  render() {
    const {
      emailError,
      oldPasswordError,
      newPasswordError,
      confirmNewPasswordError,
      generalError,
      successMessage,
    } = this.state;

    return (
      <Fragment>
        <div className="medium-offset-4 medium-4 text-center">
          <h5>Change Password</h5>
          <br />
          {generalError &&
              <div
                  style={{
                    color: "red",
                    fontSize: "larger",
                    fontWeight: "bold"
                  }}
              >
                {generalError}
              </div>
          }
          {successMessage &&
              <div
                  style={{
                    color: "green",
                    fontSize: "larger",
                    fontWeight: "bold"
                  }}
              >
                {successMessage}
              </div>
          }
          <form onSubmit={this.handleChangePasswordSubmit} className="change-password-form">
            <div className="input-group">
              <input
                  type="text"
                  placeholder="Email"
                className={`input-group-field ${emailError ? "input-error" : ""}`}
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
                  placeholder="Old Password"
                  className={`input-group-field ${oldPasswordError ? "input-error" : ""}`}
                ref={this.oldPasswordField}
                required
              />
              {oldPasswordError &&
                  <div
                      style={{
                        color: "red",
                        fontSize: "larger",
                        fontWeight: "bold"
                      }}
                  >
                    {oldPasswordError}
                  </div>
              }
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                className={`input-group-field ${newPasswordError ? "input-error" : ""}`}
                ref={this.newPasswordField}
                required
              />
              {newPasswordError &&
                  <div
                      style={{
                        color: "red",
                      }}
                  >
                    {newPasswordError}
                  </div>
              }
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                className={`input-group-field ${confirmNewPasswordError ? "input-error" : ""}`}
                ref={this.confirmNewPasswordField}
                required
              />
              {confirmNewPasswordError && (
                <div
                  style={{
                    color: "red",
                  }}
                >
                  {confirmNewPasswordError}
                </div>
              )}
            </div>
            <button type="submit" className="button">
              Change Password
            </button>
          </form>
        </div>
      </Fragment>
    );
  }
}

ChangePassword.propTypes = {
  onChangePasswordSuccess: PropTypes.func,
  onChangePasswordFailure: PropTypes.func,
};

export default ChangePassword;
