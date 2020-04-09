import React from 'react';
import { connect } from 'react-redux';

import madeBy from '../assets/MadeByICTSWhite.svg';

const pages = ["Monitoramento", "Configuração", "Informações"]

const Sidebar = (props) => {
    <div className={props.openSidebar ? "sidebar open" : "sidebar"}>
        <ul>
            {
                pages.map( (page, index) => {
                    return(
                        <li
                        onClick={() => {
                            props.changePage(page.toUpperCase());
                            props.openSidebarEvent();
                        }}
                        className={
                            (props.openedPage === page.toUpperCase()) ? "list-active" : ""
                        }       
                        >{page}</li>
                    );
                });
            }
        </ul>
        <img src={madeBy} alt=""/>
    </div>
}

const mapStateToProps = (state) => ({
    openSidebar: state.openSidebar,
    openedPage:state.openedPage
});

const mapDispatchToProps = (dispatch) => ({
    changePage: (page_name) => dispatch({ type: "CHANGE_PAGE", payload: page_name}),
    openSidebarEvent: () => dispatch({ type: "OPEN_CLOSE_SIDEBAR" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)