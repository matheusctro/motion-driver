import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import api from '../../services/api';


import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import './styles.css';

import { makeStyles, IconButton } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';


const columns = [
    { id: 'sequence', 
      label: 'Sequência', 
      minWidth: 10, 
      align: 'center' },

    { id: 'cmmd',
      label: 'Comando',
      minWidth: 100, 
      align: 'center', 
      color:'white' },
    // { id: 'params', label: 'Parâmetros', minWidth: 100, align: 'center' },
];

function createData(sequence, cmmd) {
    // const density = population / size;
    return { sequence, cmmd };
}

const useStyles = makeStyles((theme) => ({
    cels: {
        // outline: '1px solid black',
        fontSize: '16px',
        padding: 5,
        // margin: 0,
        color:'#4d4d4d',
        align: 'center',
        font: 'Roboto',
        backgroundColor: 'white'
        /*borderRadius:'8px'*/
        /*outline: '1px solid black'*/
    },
}));

const decode = (cmmd) => {
    let cmd;
    let param;
    let comando;

    let i;
    for (i in cmmd) {
        cmd = i;
        param = cmmd[i];
    }

    switch (cmd) {
        case 'interpolar_abs':
            if (param == "INICIO") {
                comando = 'INTERPOLAR_ABS(INICIO)';
            } else if (param == "FIM") {
                comando = 'INTERPOLAR_ABS(FIM)';
            }else{
                let step = [];
                for (i in param) {
                    step.push(param[i]);
                }
                comando = 'INTERPOLAR_ABS(' + step[0] + ',' + step[1] + ',' + step[2] + ')';
            }
            break;
        case 'interpolar':
            if (param == "INICIO") {
                comando = 'INTERPOLAR(INICIO)';
            } else if (param == "FIM") {
                comando = 'INTERPOLAR(FIM)';
            }else{
                let step = [];
                for (i in param) {
                    step.push(param[i]);
                }
                comando = 'INTERPOLAR(' + step[0] + ',' + step[1] + ',' + step[2] + ')';
            }
            break;
        case 'mover':
            if (param == "INICIO") {
                comando = 'MOVER(INICIO)';
            } else if (param == "FIM") {
                comando = 'MOVER(FIM)';
            }else{
                let step = [];
                for (i in param) {
                    step.push(param[i]);
                }
                comando = 'MOVER(' + step[0] + ',' + step[1] + ',' + step[2] + ')';
            }
            break;
        case 'mover_abs':
            if (param == "INICIO") {
                comando = 'MOVER_ABS(INICIO)';
            } else if (param == "FIM") {
                comando = 'MOVER_ABS(FIM)';
            }else{
                let step = [];
                for (i in param) {
                    step.push(param[i]);
                }
                comando = 'MOVER_ABS(' + step[0] + ',' + step[1] + ',' + step[2] + ')';
            }
            break;
        case 'acionar':
            comando = 'ACIONAR(' + param + ')';
            break;
        case 'desacionar':
            comando = 'DESACIONAR(' + param + ')';
            break;
        case 'confirma':
            comando = 'CONFIRMA(' + param.in +','+ param.nivel.toUpperCase() + ')';
            break;
        case 'esperar':
            comando = 'ESPERAR(' + param + ')';
            break;
        case 'velocidade':
            let vel = [];
            for (i in param) {
                vel.push(param[i]);
            }
            comando = 'VELOCIDADE(' + vel[0] + ',' + vel[1] + ',' + vel[2] + ')';
            break;
    }

    return comando;
}

export default function ProgramTable () { 
    const classes = useStyles();
    const dispatch = useDispatch();

    const motions = useSelector(state => state.configure.motions);
    const motion_select = useSelector(state => state.configure.motion_select);
    const commands = useSelector(state => state.configure.commands);
    const indexNewCommand = useSelector(state => state.configure.indexNewCommand);

    let rows = [];

    commands.map(cmmd => {
        rows.push(createData(rows.length + 1, decode(cmmd)));
        console.log(cmmd);
    });

    const handleExecuteCommand = async(linha) => {
        let execute = commands[linha.sequence -1];
        await api.post(`/execute`, execute);
    }

    const handleDeleteCommand = (linha) => {
        let com = commands;
       com.splice(linha.sequence - 1, 1);

        dispatch({type: 'COMMANDS', commands: []});
        dispatch({ type: 'COMMANDS', commands: com });
    }

    const handleEditCommand = (linha) =>{
        dispatch({ type: 'SET_INDEX_NEW_COMMAND', indexNewCommand: (linha.sequence)});
        dispatch({ type: 'SET_OPEN_MODAL_COMMAND', openModalNewCommand: true });
    }

    return (
        <Table className="tabela"  aria-label="caption table">
            <TableHead>
                <TableRow style={{backgroundColor: 'gray'}}>
                    <TableCell className={classes.cels} align='center'>Executar</TableCell>
                    {columns.map( (column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth}}
                            className={classes.cels}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                    <TableCell className={classes.cels} align='center'>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { rows.map( (row) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell className={classes.cels} align='center' style={{width: '100px', fontSize: '16px'}}>
                            <IconButton onClick = { () => {handleExecuteCommand(row)}} ><PlayArrowIcon color="secundary" /></IconButton>
                        </TableCell>
                        {columns.map( (column) => {
                            const value = row[column.id];
                            return (
                                <TableCell className={classes.cels} align={column.align}>
                                    {value}
                                </TableCell>
                            );
                        })}
                        <TableCell className={classes.cels} align='center' style={{minWidth: '128px', fontSize: '16px'}}>
                            <IconButton onClick = { () => {handleEditCommand(row)} }><EditIcon color="secundary" /></IconButton>
                            <IconButton onClick = { () => {handleDeleteCommand(row)} }><DeleteIcon color="secundary" /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                
            </TableBody>
        </Table>
    )
}