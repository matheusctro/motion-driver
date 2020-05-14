import React, { Component } from 'react';
import Sidebar from '../sidebar';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                {this.props.children}

                <Sidebar />
            </div>
        );
    }
}

export default Menu;