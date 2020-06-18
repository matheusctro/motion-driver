import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

import './motorGainsConfig.css';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Fade, BottomNavigationAction } from '@material-ui/core';
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
    const motorSelect = useSelector(state => state.modalGains.motorSelect);
    const proportionalGain = useSelector(state => state.modalGains.proportionalGain);
    const integralGain = useSelector(state => state.modalGains.integralGain);
    const derivativeGain = useSelector(state => state.modalGains.derivativeGain);
    //const lengthCalibration = useSelector(state => state.configure.lengthCalibration);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MOTOR_GAINS_CONFIG', openModalMotorGainsConfig: false })
    }

    const handleMotorGainsConfig = async () => {

        dispatch({ type: 'SET_OPEN_MOTOR_GAINS_CONFIG', openModalMotorGainsConfig: false })

        let data = {
            motor: '',
            kp: proportionalGain,
            ki: integralGain,
            kd: derivativeGain,
        }

        switch(motorSelect){
            case 'Motor eixo X':
                data.motor = 'x'
            break

            case 'Motor eixo Y':
                data.motor = 'y'
            break

            case 'Motor eixo Z':
                data.motor = 'z'
            break        
        }
        
        await api.post('update-gains', data)
        /*{"motor": "y", "kp": 100, "kd" : 70, "ki": 1}*/

        
    }

    const handleMotorSelect = async (event) => {

        let response = await api.get('/read-gains');

        dispatch({type: 'SET_SELECT_MOTOR_AXIS', motorSelect: event.target.value})

        switch(event.target.value){
            case 'Motor eixo X':
                response.data.map((axis) => {
                    if(axis.motor == 'x'){
                        dispatch({ type: 'SET_PROPORTIONAL_GAIN', proportionalGain: axis.kp})
                        dispatch({ type: 'SET_INTEGRAL_GAIN', integralGain: axis.ki })
                        dispatch({ type: 'SET_DERIVATIVE_GAIN', derivativeGain: axis.kd}) 
                    }                
                })
            break

            case 'Motor eixo Y':
                    response.data.map((axis) => {
                        if(axis.motor == 'y'){
                            dispatch({ type: 'SET_PROPORTIONAL_GAIN', proportionalGain: axis.kp})
                            dispatch({ type: 'SET_INTEGRAL_GAIN', integralGain: axis.ki })
                            dispatch({ type: 'SET_DERIVATIVE_GAIN', derivativeGain: axis.kd}) 
                        }                
                    }) 
            break

            case 'Motor eixo Z':
                    response.data.map((axis) => {
                        if(axis.motor == 'z'){
                            dispatch({ type: 'SET_PROPORTIONAL_GAIN', proportionalGain: axis.kp})
                            dispatch({ type: 'SET_INTEGRAL_GAIN', integralGain: axis.ki })
                            dispatch({ type: 'SET_DERIVATIVE_GAIN', derivativeGain: axis.kd}) 
                        }                
                    })                
            break        
        }
    };
    
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

    const handleProportionalGain = (event) => {
        dispatch({ type: 'SET_PROPORTIONAL_GAIN', proportionalGain: event.target.value})  
    }

    const handleIntegralGain = (event) => {
        dispatch({ type: 'SET_INTEGRAL_GAIN', integralGain: event.target.value })
    }

    const handleDerivativeGain = (event) => {
        dispatch({ type: 'SET_DERIVATIVE_GAIN', derivativeGain: event.target.value}) 
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalMotorGainsConfig}
            onClose={handleCloseModal}
        >
            <Fade in={openModalMotorGainsConfig}>
                <div className="modal-motorgains">
                    <div className="modal-header-gainsconfig">
                        <p>Configuração dos ganhos</p>
                    </div>
                    <div className="motor-selection">
                        <TextField className={classes.select}
                                   id="select-motor"
                                   select
                                   label="Selecione o motor"
                                   value={motorSelect}
                                   onChange={handleMotorSelect}
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
                            <input type="number" className="input-gain" value={proportionalGain} onChange={handleProportionalGain}/>
                            <label>Ganho Integral(Ki):</label>
                            <input type="number" className="input-gain" value={integralGain} onChange={handleIntegralGain}/>
                            <label>Ganho derivativo(Kd):</label>
                            <input type="number" className="input-gain" value={derivativeGain} onChange={handleDerivativeGain}/>
                        </div>
                    </div>

                    <div className="modal-footer-gainsconfig">
                        <button className="btn-cancelar-gainsconfig" onClick={handleCloseModal}> Cancelar </button>
                        <button className="btn-salvar-gainsconfig" onClick={handleMotorGainsConfig}> Salvar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}