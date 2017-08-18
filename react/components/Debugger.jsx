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

const style = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    height: '100%',
    overflow: 'auto',
};

export default class Debugger extends React.Component {
    state = {
        open: true
    };

    state = {
        activePanel: 1
    };

    toggle = (event) => {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <div style={style} id="debug-panel">
                {this.state.open
                    ? (
                        <div>
                            <div>
                                <button onClick={() => this.setState({ activePanel: 1 })}>State</button>
                                <button onClick={() => this.setState({ activePanel: 2 })}>History</button>
                                <button onClick={this.toggle}>Hide</button>
                            </div>
                            <div className="debug-content">
                                {this.state.activePanel == 1
                                ? <ObjectDump object={this.props.state} />
                                : <ActionHistory history={this.props.actionHistory} />
                                }
                            </div>
                        </div>)
                    : <div onClick={this.toggle}>🐛</div>}
            </div>
        );
    }
}