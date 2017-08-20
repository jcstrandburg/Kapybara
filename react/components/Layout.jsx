import { Link } from 'react-router-dom';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

export default class Layout extends Component {
    renderChatChannel = (channel) => {(
        <Link to={'/'+this.props.organizationToken+'/chat/channel'}>Chat</Link>
    )}

    render() {return (
        <div className="layout">
            <div className="layout-nav">
                kapybara Header
                <ul>
                    <li><Link to={'/'+this.props.organizationToken+'/projects'}>Projects</Link></li>
                    <li>
                        Chat
                        {Object.values(this.props.chatChannels).map(this.renderChatChannel)}
                    </li>
                    <li><Link to="/settings">S</Link></li>
                </ul>
                <hr/>
            </div>
            <div className="layout-content">
                { this.props.children }
            </div>
        </div>
    )}
}

Layout.propTypes = {
    organizationToken: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(PropTypes.object).isRequired,
};
