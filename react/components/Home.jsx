import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Home extends Component {
    state = {
        organizationName: ""
    };

    componentDidMount() {
        this.props.onLoad();
    }

    renderOrganization(org) {
        return (
            <li key={org.id}>
                <Link to={'/'+org.token+'/projects'}>{org.name}</Link>
            </li>
        );
    }

    handleOrgNameChange = (event) => {
        this.setState({organizationName: event.target.value})
    }

    handleSubmit = (event, form) => {
        this.props.createOrganization({
            token: this.state.organizationName,
            name: this.state.organizationName
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Link to="/settings">Settings</Link>
                <br />
                <div>Home</div>
                <ul>
                    {this.props.user && this.props.user.organizations
                        ? this.props.user.organizations.map(this.renderOrganization)
                        : 'loading2...'}
                </ul>

                <form onSubmit={this.handleSubmit}>
                    <label>Organization Name:
                        <input type="text" value={this.state.organizationName} onChange={this.handleOrgNameChange}/>
                    </label>
                    <input type="submit" value="Create Organization" />
                </form>
            </div>
        );
    }   
}

Home.propTypes = {
    createOrganization: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,

    user: PropTypes.shape({
        id: PropTypes.id,
        name: PropTypes.string,
        alias: PropTypes.string,
        organizations: PropTypes.arrayOf(PropTypes.object)
    }),
};
