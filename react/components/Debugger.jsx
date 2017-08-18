import React from 'react';
import uuid from 'uuid/v4';

import ObjectDump from './ObjectDump.jsx';

class ActionHistory extends React.Component {
    renderItemProperty = (propName, propValue) => {
        return (
            <div className="debug-history-item-property" key={uuid()}>
                {typeof propValue === 'object' && propValue != null
                    ? <div>
                        <div className="debug-history-object-item-propname">{propName}:</div>
                        <div className="debug-history-object-item-propvalue">{JSON.stringify(propValue, null, 2)}</div>
                    </div>
                    : <div>
                        <div className="debug-history-scalar-item-propname">{propName}:</div>
                        <div className="debug-history-scalar-item-propvalue">{JSON.stringify(propValue, null, 2)}</div>
                    </div>
                }
            </div>
        );
    }

    renderHistoryItem = (item) => {
        let { type, asyncDispatch, ...properties } = item;

        return (
            <div className="debug-history-item" key={uuid()}>
                <div className="debug-history-item-type">{type}: </div>
                {Object.keys(properties).map(key => this.renderItemProperty(key, properties[key]))}
            </div>
        );
    }

    render() {
        return (
            <div className="debug-history">
                {this.props.history.slice().reverse().map(this.renderHistoryItem)}
            </div>
        );
    }
}

export default class Debugger extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    toggle = (event) => {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <div>
                <div onClick={this.toggle}>Debugger</div>
                {this.state.open
                    ? (
                        <div className="debug-content">
                            <ObjectDump object={this.props.state} />
                            <ActionHistory history={this.props.actionHistory} />
                        </div>)
                    : null}
            </div>
        );
    }
}