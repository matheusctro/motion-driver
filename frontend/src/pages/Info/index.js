import React from 'react';
import './styles.css';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';


const Info = (props) => {
    return (
        <Menu>
            <Topbar pageName="Informações" />
            <div className="container info_mode_container">
                <div className="text_container">
                    <h1>Modo Informações</h1>
                </div>
            </div>
        </Menu>
    );
}

export default Info;