import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

import './motorGainsConfig.css';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Fade } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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
    select: {
        height: '50px',
        width: '350px',
        marginTop: '1px',
        marginBottom: '1px',
      },
  /*root: {
        '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
    },*/
}));

export default function MotorGainsConfigModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const openModalMotorGainsConfig = useSelector(state => state.configure.openModalMotorGainsConfig);
    //const lengthCalibration = useSelector(state => state.configure.lengthCalibration);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MOTOR_GAINS_CONFIG', openModalMotorGainsConfig: false })
    }

    const handleMotorGainsConfig = async () => {
        /*await api.post(`/calibration?sizeX=${lengthCalibration[0]}&sizeY=${lengthCalibration[1]}&sizeZ=${lengthCalibration[2]}`);*/

        dispatch({ type: 'SET_OPEN_MOTOR_GAINS_CONFIG', openModalMotorGainsConfig: false })
    }

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    const [currency, setCurrency] = React.useState('EUR');

    const motors = [
        {
          label: 'Motor eixo X',
          value: 'Motor eixo X',
        },
        {
          label: 'Motor eixo Y',
          value: 'Motor eixo Y',
        },
        {
          label: 'Motor eixo Z',
          value: 'Motor eixo Z',
        },
      ];
/*
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
*/
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalMotorGainsConfig}
            onClose={handleCloseModal}

        >
            <Fade in={openModalMotorGainsConfig}>
                <div className="modal">
                    <div className="modal-header">
                        <p>Configuração dos ganhos</p>
                    </div>
                    <div className="motor-selection">
                        <TextField className={classes.select}
                                   id="select-motor"
                                   select
                                   label="Selecione o motor"
                                   value={currency}
                                   onChange={handleChange}
                                   variant="outlined"
                        >
                        {motors.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                        </TextField>
                    </div>
                    <div className="modal-body-gains">
                        <div className="gainsConfig">
                            <label>Ganho proporcional(Kp):</label>
                            <input type="number" className="input-gain" /*onChange={handle_x}*/ />
                            <label>Ganho Integral(Ki):</label>
                            <input type="number" className="input-gain" /*onChange={handle_y}*/ />
                            <label>Ganho derivativo(Kd):</label>
                            <input type="number" className="input-gain" /*onChange={handle_z}*/ />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancelar" onClick={handleCloseModal}> Cancelar </button>
                        <button className="btn-salvar" onClick={handleMotorGainsConfig}> Salvar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}