import React from 'react';
import './styles.css';
import $ from 'jquery';
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
                        <li className="list-monitoramento list-active">Monitoramento</li>
                        <li className="list-manutencao">Manutenção</li>
                        <li className="list-configuracoes">Configurações</li>
                        <li className="list-registro">Registro de Usuário</li>
                    </ul>
                    <div className="madeby">
                        <img src={madebyImg} alt="Made by ICTS" />
                    </div>
                </div>
            </div>

        </div>

    );
}