import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

import './confirmation.css';
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

export default function ConfirmationClearModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const motions = useSelector(state => state.configure.motions);
    const motion_select = useSelector(state => state.configure.motion_select);
    const openModalConfirmationClear = useSelector(state => state.configure.openModalConfirmationClear);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_CONFIRMATION_CLEAR', openModalConfirmationClear: false });
    }

    const handleConfirma = async () => {
        let id = 0;

        motions.map(motion => {
            if (motion.name == motion_select) {
                id = motion.id;
            }
        });

        await api.post(`/clear?id=${id}`);
        dispatch({ type: 'COMMANDS', commands: [] });
        dispatch({ type: 'SET_OPEN_MODAL_CONFIRMATION_CLEAR', openModalConfirmationClear: false });
    }
 
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalConfirmationClear}
            onClose={handleCloseModal}
        >
            <Fade in={openModalConfirmationClear}>
                <div className="modal-confir">
                    <div className="modal-body-confir">
                        <p> Tem certeza que deseja limpar o programa? </p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick = {handleCloseModal} > Cancelar </button>
                        <button className="btn-salvar" onClick = {handleConfirma}> Confirmar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}