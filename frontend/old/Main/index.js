import React from 'react';
import './styles.css';
// import { useHistory } from 'react-router-dom';

import madebyImg from '../../assets/MadeByICTSWhite.svg';

export default function Logon() {
    const name = localStorage.getItem('user_id');

    return (
        <div className="full-container">
            <div className="topbar">
                <div className="topbar-left">
                    <span>
                        <div className="btn-togglemenu" onClick={() => document.getElementById('sidemenu-inside').classList.toggle('active') }>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </span>
                </div>
                <div className="topbar-center">
                    <span className="actual_page">Motion Drive</span>
                </div>
                <div className="topbar-right">
                    <span > 
                        <p></p>
                        <span>Olá, {name}</span> <p></p>
                        <a href="/">Sair</a><i className="fa fa-chevron-down"></i> 
                    </span>
                </div>
            </div>

            <div className="inside_container">
                <div className="sidemenu-inside" id="sidemenu-inside">
                    <ul>
                        <li className="list-monit list-active">Monitoramento</li>
                        <li className="list-config">Configurações</li>
                        <li className="list-infos">Informações</li>
                    </ul>
                    <div className="madeby">
                        <img src={madebyImg} alt="Made by ICTS" />
                    </div>
                </div>
            </div>

            <div className="container monitoring_mode_container">
                <div class="text_container">
                    <h1>Modo Monitoramento</h1>
                    <p>Alguns recursos como interagir com os atuadores não estão disponíveis no modo
                        monitoramento</p>
                </div>
            </div>

            <div className="container configuration_mode_container">
                <div class="text_container">
                    <h1>Modo Configuração</h1>
                </div>
            </div>

            <div className="container info_mode_container">
                <div class="text_container">
                    <h1>Modo Informações</h1>
                </div>
            </div>

        </div>

    );
}