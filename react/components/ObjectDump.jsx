import React from 'react';
import PropTypes from 'prop-types';

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

ObjectDump.propTypes = {
    object: PropTypes.object,
};