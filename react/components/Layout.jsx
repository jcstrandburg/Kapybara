import { Link } from 'react-router-dom';

export default class Layout extends React.Component {
    render() {return (
        <div>
            <div>
                kapybara Header
                <ul>
                    <li><Link to={'/'+this.props.organizationToken+'/projects'}>Projects</Link></li>
                    <li><Link to={'/'+this.props.organizationToken+'/chat'}>Chat</Link></li>
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