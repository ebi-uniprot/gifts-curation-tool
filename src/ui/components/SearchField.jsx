import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    const { handleSearchSubmit } = this.props;

    return (
      <Fragment>
        <form
          onSubmit={e => handleSearchSubmit(e, this.inputField.current.value)}
          className="input-group"
        >
          <input
            type="text"
            placeholder="ENST00000620613, A7E2Y1, ..."
            className="input-group-field"
            ref={this.inputField}
          />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </Fragment>
    );
  }
}

SearchField.propTypes = {
  handleSearchSubmit: PropTypes.func.isRequired,
};

export default SearchField;
