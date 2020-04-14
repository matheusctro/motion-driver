import React from 'react';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Links from './menu/links';
import { PAGES } from '../config';
import './sidebar.css';

import madeBy from '../assets/MadeByICTSWhite.svg';

const Sidebar = (props) => {
    const exitHandleOnClick = history => {
        props.closeSideBar();
        history.push('/');
    }

    return (
        <Drawer 
            open={props.openSidebar}
            onClose={e => props.closeSideBar()}>
            <div className="sidebar-padding-top">
                {Object.keys(PAGES).map((k, index) => (
                                                    <Links label={k}
                                                            index={index}
                                                            key={index}
                                                            onClick={() => props.closeSideBar()}
                                                            location={props.location}
                                                            to={`${PAGES[k]}`}/>
                ))}
                <Button className="sidebar-link-button" onClick={() => exitHandleOnClick(props.history)}>Sair</Button>
                <img className="logo-icts" src={madeBy} alt="Made by ICTS"/>
            </div>
        </Drawer>
    )
}

const mapStateToProps = (state) => ({
    openSidebar: state.general.openSidebar,
});

const mapDispatchToProps = (dispatch) => ({
    closeSideBar: () => dispatch({ type: 'ON_CLOSE_SIDEBAR' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar))