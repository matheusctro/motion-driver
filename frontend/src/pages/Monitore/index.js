import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';
// import { useHistory } from 'react-router-dom';

const Monitore = (props) => {
    return (
        <Menu>
            <Topbar pageName="Monitoramento" />
            <div className="container monitoring_mode_container">
                <div className="text_container">
                    <h1>Modo Monitoramento</h1>
                    <p>Alguns recursos como interagir com os atuadores não estão disponíveis no modo
                        monitoramento</p>
                </div>
            </div>
        </Menu>
    );
}

export default Monitore;