import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import api from '../../services/api';

import './styles.css';
import { makeStyles} from '@material-ui/core/styles';
import { TextField, Modal,Fade} from '@material-ui/core';
import { loadMotions } from '../../actions';

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

export default function NewMotionModal () { 
    const classes = useStyles();
    const dispatch = useDispatch();

    const motions = useSelector(state => state.configure.motions);
    const openModalNewMotion = useSelector(state => state.configure.openModalNewMotion);
    const nameNewMotion = useSelector(state => state.configure.nameNewMotion);

    let motion =   {
        "id": 1,
        "name": "Programa",
        "qtd_cmmds": 0,
        "cmmds": []
    }

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_MOTION', openModalNewMotion: false })
    }

    const handleNewMotion = async() => {
        if(nameNewMotion != ''){
            motion.name = nameNewMotion;
            motion.id = motions.length;
            await api.post(`/motion`, motion);
        }
        
        dispatch({ type: 'SET_OPEN_MODAL_MOTION', openModalNewMotion: false });
        loadMotions();
    }

    const handleName = (event) => {
        dispatch({ type: 'SET_NAME_MOTION', nameNewMotion: event.target.value });
    }
   
    return (
        <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModalNewMotion}
                onClose={handleCloseModal}
            >
            <Fade in={openModalNewMotion}>
                <div className="modal">
                    <div className="modal-header">
                        <p >Novo Programa</p>
                    </div>
                    <div className="modal-body">
                        <TextField
                            className={classes.textField}
                            style={{ margin: 8 }}
                            fullWidth
                            id="outlined-basic"
                            label="Nome"
                            variant="outlined"
                            size="small"
                            onChange={handleName}
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={handleCloseModal} > Cancelar </button>
                        <button className="btn-salvar" onClick={handleNewMotion}> Salvar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}