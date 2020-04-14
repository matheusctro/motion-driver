import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';

const Configure = (props) => {
    return (
        <Menu>
            <Topbar pageName="Configuração" />
            <div className="container configuration_mode_container">
                <div className="text_container">
                    <h1>Modo Configuração</h1>
                </div>
            </div>
        </Menu>

    );
}

export default Configure;