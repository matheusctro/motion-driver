import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './alert.css';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Fade } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
}));

export default function StatusModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const openModalStatus = useSelector(state => state.configure.openModalStatus);
    const status = useSelector(state => state.configure.status);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_STATUS', openModalAlert: false })
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalStatus}
            onClose={handleCloseModal}
        >
            <Fade in={openModalStatus}>
                <div className="modal-alert">
                    <div className="modal-body-alert">
                        <p> {status} </p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-salvar" onClick = {handleCloseModal}> OK </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}