import PropTypes from 'prop-types';
import { Component } from 'react';

export default class ActionButton extends Component {
    render() {return (
        <button onClick={this.props.onClick}>{this.props.text}</button>
    )};
}

ActionButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};
