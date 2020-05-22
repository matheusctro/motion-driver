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

export default function AlertModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const openModalAlert = useSelector(state => state.configure.openModalAlert);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_ALERT', openModalAlert: false })
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalAlert}
            onClose={handleCloseModal}
        >
            <Fade in={openModalAlert}>
                <div className="modal-alert">
                    <div className="modal-body-alert">
                        <p> Escolha um programa! </p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-salvar" onClick = {handleCloseModal}> OK </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}