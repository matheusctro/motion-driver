import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';

import './styles.css';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, MenuItem, Modal, Fade, Step } from '@material-ui/core';
import { number } from 'prop-types';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    select: {
        height: '50px',
        width: '200px',
        marginTop: '1px',
        marginBottom: '1px',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '27ch',
    },
    textField_command: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '30px',
    },
}));

const commandsTypes = ['MOVER', 'MOVER_ABS', 'ACIONAR', 'DESACIONAR', 'CONFIRMA', 'ESPERAR'];

const uncode = (cmmd) => {
    let cmd;
    let param;
    let comando;

    var index = cmmd.indexOf("(");
    cmd = cmmd.slice(0, index);
    param =  cmmd.slice(index+1, cmmd.length-1);
    
    let i;
    switch (cmd) {
        case 'MOVER':
            if (param == "INICIO") {
                comando = { 'mover': "INICIO" };
            } else if (param == "FIM") {
                comando = { 'mover': "FIM" };
            }else{
                let step = [];
                index = param.indexOf(",");
                step[0] = param.slice(0,index);
                param = param.slice(index +1 );
                index = param.indexOf(",");
                step[1] = param.slice(0,index);
                step[2] = param.slice(index + 1);

                for(i = 0; i <3 ; i++) step[i] = (step[i] != "none")? Number(step[i]):step[i];
               
                comando = { 'mover': {"x": "none", "y":"none", "z":"none"}};
                comando.mover.x = step[0];
                comando.mover.y = step[1];
                comando.mover.z = step[2];
            }
            break;
        case 'MOVER_ABS':
                if (param == "INICIO") {
                    comando = { 'mover_abs': "INICIO" };
                } else if (param == "FIM") {
                    comando = {'mover_abs': "FIM" };
                }else{
                    let step = [];
                    index = param.indexOf(",");
                    step[0] = param.slice(0,index);
                    param = param.slice(index +1 );
                    index = param.indexOf(",");
                    step[1] = param.slice(0,index);
                    step[2] = param.slice(index + 1);
    
                    for(i = 0; i <3 ; i++) step[i] = (step[i] != "none")? Number(step[i]):step[i];
                   
                    comando = { 'mover_abs': {"x": step[0], "y":step[1], "z":step[2]}};
                }
            break;
        case 'ACIONAR':
            comando = { 'acionar': Number(param) };
            break;
        case 'DESACIONAR':
            comando = { 'desacionar': Number(param) };
            break;
        case 'ESPERAR':
            comando = {'esperar': Number(param) };
            break;
        case 'CONFIRMA':
            let inn;
            let nivel;

            index = param.indexOf(",");
            inn = Number(param.slice(0,index));
            nivel = param.slice(index+1).toLowerCase();
            comando =  { confirma: { 'in': inn, 'nivel': nivel } };
            break;
    }
    return comando;
}

export default function NewCommandModal() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const commands = useSelector(state => state.configure.commands);
    const command = useSelector(state => state.configure.command);
    const params = useSelector(state => state.configure.params);
    const command_select = useSelector(state => state.configure.command_select);
    const openModalNewCommand = useSelector(state => state.configure.openModalNewCommand);
    const pos = useSelector(state => state.configure.pos);
    const indexNewCommand = useSelector(state => state.configure.indexNewCommand);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_OPEN_MODAL_COMMAND', openModalNewCommand: false });
        dispatch({ type: 'SET_POSITION', pos: {"x": "none", "y":"none", "z":"none"} });
        dispatch({ type: 'SET_PARAMS', params: '' });
    }

    const handleCommand = (event) => {
        dispatch({ type: 'SELECT_COMMAND', command_select: event.target.value });
        dispatch({ type: 'SET_PARAMS', params: '' });
    }

    const setParam = (param) => {
        let comm = command_select + "(" + param + ")";

        dispatch({ type: 'SET_PARAMS', params: param });
        dispatch({ type: 'SET_COMMAND', command: comm});
    }

    const handle_x = (event) => {
        let position = pos;
        position.x = event.target.value;

        dispatch({ type: 'SET_POSITION', pos: position });
    }

    const handle_y = (event) => {
        let position = pos;
        position.y = event.target.value;
        
        dispatch({ type: 'SET_POSITION', pos: position });
    }

    const handle_z = (event) => {
        let position = pos;
        position.z = event.target.value;
        
        dispatch({ type: 'SET_POSITION', pos: position });
    }

    const handlePoint = () =>{
        let param = pos.x + ',' + pos.y + ',' + pos.z;
        let comm = command_select + "(" + param + ")";

        dispatch({ type: 'SET_PARAMS', params: param });
        dispatch({ type: 'SET_COMMAND', command: comm});
    }

    const handle_time = (event) => {
        let comm = command_select + "(" + event.target.value + ")";

        dispatch({ type: 'SET_PARAMS', params: event.target.value });
        dispatch({ type: 'SET_COMMAND', command: comm});
    }

    const handleAddCommand = () => {
        dispatch({ type: 'SET_OPEN_MODAL_COMMAND', openModalNewCommand: false });

        if(indexNewCommand == 0){
            dispatch({type: 'COMMANDS', commands: [ ...commands, uncode(command)]});
        }else{
            let com = commands;
            com[indexNewCommand] = uncode(command);
            dispatch({type: 'COMMANDS', commands: []});
            dispatch({ type: 'COMMANDS', commands: com });
        }
    } 

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModalNewCommand}
            onClose={handleCloseModal}
        >
            <Fade in={openModalNewCommand}>
                <div className="modal-c">
                    <div className="modal-c-header">
                        <TextField
                            className={classes.textField}
                            variant='outlined'
                            id="select-program"
                            select
                            label="Comando"
                            value={command_select}
                            onChange={handleCommand}
                            size="small"
                        >
                            {commandsTypes.map(command => (
                                <MenuItem key={command} value={command}>
                                    {command}
                                </MenuItem>
                            ))}
                        </TextField>

                    </div>
                    <div className="modal-c-body">
                        {(command_select == 'MOVER' || command_select == 'MOVER_ABS') ?
                            (
                                <div>
                                    <div>
                                        <p> Escolha uma opção </p>
                                    </div>
                                    <div className="commands-container">
                                        <div>
                                            <button className="btn-commands" onClick = {() => { setParam("INICIO")} }> INICIO </button>
                                            <button className="btn-commands" onClick = {() => { setParam("FIM")}} > FIM </button>
                                        </div>
                                        <div className="point">
                                            <div>
                                                <button className="btn-commands" onClick = {handlePoint}> PONTO </button>
                                            </div>
                                            <div className="point-xyz">
                                                <label>X:</label>
                                                <input type="number" className="input-xyz" onChange = {handle_x}/>
                                                <label>Y:</label>
                                                <input type="number" className="input-xyz" onChange = {handle_y}/>
                                                <label>Z:</label>
                                                <input type="number" className="input-xyz" onChange = {handle_z}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="command">
                                        {command_select + "(" + params + ")"}
                                    </div>
                                </div>
                            ) : ((command_select == 'ESPERAR') ?
                                (
                                    <div>
                                        <div>
                                            <p> Digite um tempo em milissegundos: </p>
                                        </div>

                                        <div className="time">
                                            <input type="number" className="input-time" onChange = {handle_time} min = '0'/>
                                            <label> ms</label>
                                        </div>

                                        <div className="command">
                                            {command_select + "(" + params + ")"}
                                        </div>
                                    </div>
                                ) : ((command_select == 'ACIONAR') ?
                                    (
                                        <div>
                                            <div>
                                                <p> Escolha uma das saídas a ser acionada: </p>
                                            </div>

                                            <div className="in-out">
                                                <button className="btn-io" onClick = {() => { setParam(0)}} > 0 </button>
                                                <button className="btn-io" onClick = {() => { setParam(1)}}> 1 </button>
                                                <button className="btn-io" onClick = {() => { setParam(2)}} > 2 </button>
                                                <button className="btn-io" onClick = {() => { setParam(3)}} > 3 </button>
                                            </div>

                                            <div className="command">
                                                {command_select + "(" + params + ")"}
                                            </div>
                                        </div>

                                    ) : ((command_select == 'DESACIONAR') ?
                                        (
                                            <div>
                                                <div>
                                                    <p> Escolha uma das saídas a ser desacionada: </p>
                                                </div>

                                                <div className="in-out">
                                                    <button className="btn-io"  onClick = {() => { setParam(0)}}> 0 </button>
                                                    <button className="btn-io"  onClick = {() => { setParam(1)}}> 1 </button>
                                                    <button className="btn-io"  onClick = {() => { setParam(2)}}> 2 </button>
                                                    <button className="btn-io"  onClick = {() => { setParam(3)}}> 3 </button>
                                                </div>

                                                <div className="command">
                                                    {command_select + "(" + params + ")"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div>
                                                    <p> Escolha uma das entradas a ser confirmada: </p>
                                                </div>
                                                <div className="confirma">
                                                    <div>
                                                        <div className="label-confirma">
                                                            <label> ON </label>
                                                        </div>
                                                        <div className="label-confirma">
                                                            <label> OFF </label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className="btn-io"  onClick = {() => { setParam('0,ALTO')}}> 0 </button>
                                                        <button className="btn-io" onClick = {() => { setParam('1,ALTO')}}> 1 </button>
                                                        <button className="btn-io" onClick = {() => { setParam('2,ALTO')}}> 2 </button>
                                                        <button className="btn-io" onClick = {() => { setParam('3,ALTO')}}> 3 </button>

                                                        <button className="btn-io-off" onClick = {() => { setParam('0,BAIXO')}}> 0  </button>
                                                        <button className="btn-io-off" onClick = {() => { setParam('1,BAIXO')}}> 1 </button>
                                                        <button className="btn-io-off" onClick = {() => { setParam('2,BAIXO')}}> 2 </button>
                                                        <button className="btn-io-off" onClick = {() => { setParam('3,BAIXO')}}> 3 </button>
                                                    </div>
                                                </div>
                                                <div className="command-confirma">
                                                    {command_select + "(" + params + ")"}
                                                </div>
                                            </div>
                                        )
                                    )
                                )
                            )
                        }
                    </div>
                    <div className="modal-c-footer">
                        <button className="btn-cancelar" onClick={handleCloseModal} > Cancelar </button>
                        <button className="btn-salvar" onClick={handleAddCommand} > Confirmar </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}