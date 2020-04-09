import React from 'react';
import { connect } from 'react-redux';

const Topbar = (props) => {
    <div className={ props.openSidebar ? "topbar sidebar-active" : "topbar" }>
        <div className="topbar-left">
            <div onClick={ props.openSidebarEvent }>
                <button id="hamb" className={ props.openSidebar ? "hamburguer is-active" : "hamburguer" } type="button" style={{outline: "none"}}>
                    <span className="hamburguer-box">
                        <span className="hamburguer-inner"></span>
                    </span>
                </button>
            </div>
        </div>
        <div className="topbar-center">
            <h2>{props.openedPage}</h2>
        </div>
        <div className="topbar-right">
            <div>
                Matheus Castro
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => ({
    openSidebar: state.openSidebar,
    openedPage: state.openedPage
});

const mapDispatchToProps = (dispatch) => ({
    openSidebarEvent: () => dispatch({ type: "OPEN_CLOSE_SIDEBAR" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)