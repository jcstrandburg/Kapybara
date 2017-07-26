import React from 'react';

export default class ObjectDump extends React.Component {
    render() {
        return (
            <div>
                <div>{this.props.dataName}</div>
                <pre>
                    {JSON.stringify(this.props.data)}
                </pre>
            </div>
        );
    }   
}
