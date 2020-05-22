import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { loadMotions } from '../../actions/index'

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

export default function ConfirmationDeleteModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const motions = useSelector(state => state.configure.motions);
    const motion_select = useSelector(state => state.configure.motion_select);
    const openModalConfirmationDelete = useSelector(state => state.configure.openModalConfirmationDelete);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_CONFIRMATION_DELETE', openModalConfirmationDelete: false })
    }

    const handleConfirma = async () => {
        let id = 0;

        motions.map(motion => {
            if (motion.name == motion_select) {
                id = motion.id;
            }
        });

        await api.delete(`/motion?id=${id}`);
        
        dispatch({ type: 'SET_OPEN_MODAL_CONFIRMATION_DELETE', openModalConfirmationDelete: false });
        dispatch({ type: 'SELECT_MOTION', motion_select: '' });
        dispatch({ type: 'COMMANDS', commands: []});
        loadMotions();
    }
 
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalConfirmationDelete}
            onClose={handleCloseModal}
        >
            <Fade in={openModalConfirmationDelete}>
                <div className="modal-confir">
                    <div className="modal-body-confir">
                        <p> Tem certeza que deseja apagar o programa? </p>
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