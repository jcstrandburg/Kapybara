import React from 'react';

export default class ObjectDump extends React.Component {
    render() {
        return (
            <div>
                <pre>
                    {JSON.stringify(this.props.object, null, 2)}
                </pre>
            </div>
        );
    }   
}
