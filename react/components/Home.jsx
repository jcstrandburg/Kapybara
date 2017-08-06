import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            organizationName: "",
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
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
                    {Object.values(this.props.organizations).map(this.renderOrganization)}
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
