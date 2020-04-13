import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        }
    },
}));

const Topbar = (props) => {
    const classes = useStyles();

    return (
        <Fragment>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={e => props.openSidebar()}>
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {props.pageName}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    page: state.general.page,
});

const mapDispatchToProps = (dispatch) => ({
    openSidebar: (text) => dispatch({ type: "ON_OPEN_SIDEBAR", text: text }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)