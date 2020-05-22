import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

import './calibration.css';
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

export default function CalibrationModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const openModalCalibration = useSelector(state => state.configure.openModalCalibration);
    const lengthCalibration = useSelector(state => state.configure.lengthCalibration);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_CALIBRATION', openModalCalibration: false })
    }

    const handleCalibration = async () => {
        await api.post(`/calibration?sizeX=${lengthCalibration[0]}&sizeY=${lengthCalibration[1]}&sizeZ=${lengthCalibration[2]}`);

        dispatch({ type: 'SET_OPEN_MODAL_CALIBRATION', openModalCalibration: false })
    }

    const handle_x = (event) => {
        let length = lengthCalibration;
        length[0] = event.target.value;

        dispatch({ type: 'SET_CALIBRATION', lengthCalibration: length });
    }

    const handle_y = (event) => {
        let length = lengthCalibration;
        length[1] = event.target.value;

        dispatch({ type: 'SET_CALIBRATION', lengthCalibration: length });
    }

    const handle_z = (event) => {
        let length = lengthCalibration;
        length[2] = event.target.value;

        dispatch({ type: 'SET_CALIBRATION', lengthCalibration: length });
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalCalibration}
            onClose={handleCloseModal}

        >
            <Fade in={openModalCalibration}>
                <div className="modal">
                    <div className="modal-header">
                        <p >Calibração</p>
                    </div>

                    <div className="modal-body-calib">
                        <p> Insira o tamanho de cada eixo em milímetros: </p>

                        <div className="calibration">
                            <label>X:</label>
                            <input type="number" className="input-calib" onChange={handle_x} />
                            <label>Y:</label>
                            <input type="number" className="input-calib" onChange={handle_y} />
                            <label>Z:</label>
                            <input type="number" className="input-calib" onChange={handle_z} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={handleCloseModal} > Cancelar </button>
                        <button className="btn-salvar" onClick={handleCalibration}> Enviar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}