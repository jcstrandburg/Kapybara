import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.props.getProjects(this.props.organizationToken);
    }

    renderChatChannel = (channel) => {(
        <Link to={'/'+this.props.organizationToken+'/chat/channel'}>Chat</Link>
    )}

    render() {return (
        <div>
            <div>
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
            <div>
                { this.props.children }
            </div>
        </div>
    )}
}

Layout.propTypes = {
    organizationToken: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(PropTypes.object).isRequired,
};
