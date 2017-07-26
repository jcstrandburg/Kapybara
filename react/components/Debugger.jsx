import React from 'react';

export default class Debugger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle(event) {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <div>
                <div onClick={this.toggle}>Debugger</div>
                {this.state.open ?
                (<pre>
                    {JSON.stringify(this.props.state, null, 2)}
                </pre>) : null}
            </div>
        );
    }
}