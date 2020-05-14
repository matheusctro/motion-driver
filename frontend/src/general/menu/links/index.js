import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';

const Links = props => {
    return(
        <Link
            onClick={() => props.closeSideBar()}
            style={{textDecoration: 'none'}}
            to={{ pathname: props.to, state: { from: props.location }}}
            key={props.index}
            className="sidebar-link">{}
            <Button className="sidebar-link-button">{props.label}</Button>
            
        </Link>
    )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    closeSideBar: () => dispatch({ type: 'ON_CLOSE_SIDEBAR' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Links)