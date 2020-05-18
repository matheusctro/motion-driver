import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import Graph from '../../general/graph';
import ProgramTable from '../../general/table';
import api from '../../services/api';
import './styles.css';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';

import { Grid, Paper, IconButton, TextField, MenuItem, Switch, FormControlLabel, Slider, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const marks = [
    {
        value: 2,
        label: '2mm',
    },
    {
        value: 12,
        label: '12mm',
    },
    {
        value: 22,
        label: '22mm',
    }
];

const useStyles = makeStyles((theme) => ({
    paper:{
        height: '100%',
        minWidth: '1300px',
        padding: '10px'
    },
    select: {
        height: '50px',
        width: '800px',
        marginTop: '1px',
        marginBottom: '1px',
    },
    switch: {
        width: '150px',
        padding: '9px'
    },
    slider: {
        width: '150px',
    },
    joystickbtns: {
        backgroundColor: '#3660FE',
        color: 'white',
        width: '60px',
        height: '60px',
        margin: '5px',
    }
}));

export default function Configure () {
    const classes = useStyles();
    const dispatch = useDispatch();

    const motions = useSelector(state => state.configure.motions);
    const motion_select = useSelector(state => state.configure.motion_select);
    const commands = useSelector(state => state.configure.commands);
    const dist = useSelector(state => state.configure.dist);

    const goHome = async () => {
        await api.post(`/home`);
    }

    const move = async(eixo, sentido) => {
        let json = {'mover': {'x':'none', 'y': 'none','z':'none'}};

        switch(eixo){
            case 'x':
                json.mover.x = (sentido === true) ? dist : -dist;
                break;
            case 'y':
                json.mover.y = (sentido === true) ? dist : -dist;
                break;
            case 'z':
                json.mover.z = (sentido === true) ? dist : -dist;
                break;
        }

        await api.post(`/execute`, json);
    }

    const handleFreeAxis = async (event) => {
        let value = event.target.checked ? true : false;
        await api.post(`/free-axis?value=${value}`);
    }

    const setDist = (value) => {
        dispatch({type: 'SET_DIST', dist: value})
    }
      
    const handleMotion = (e) => {
        dispatch({type: 'SELECT_MOTION', motion_select: e.target.value})
    }

    return (
        <Menu>
            <Topbar pageName="Configuração" />
            <Grid container spacing={3} style={{ padding: '20px' }} >
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <div className="select-container">
                            <TextField className={classes.select}
                                variant='outlined'
                                id="select-program"
                                select
                                label = "Motion"
                                value = {motion_select}
                                onChange = {handleMotion}
                            >
                                {motions.map(motion => (
                                    <MenuItem key={motion.id} value = {motion.name}>
                                        {motion.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <div className="btns-container">
                                <IconButton><AddIcon color="secundary" /></IconButton>
                                <IconButton><ClearAllIcon color="secundary" /></IconButton>
                                <IconButton><DeleteIcon color="secundary" /></IconButton>
                                <button className="btn-calibration">Calibração</button>
                            </div>
                        </div>
                        
                        <div className="main-config">
                            <div className="points-interaction-container">
                                <div className="points-config">
                                    <div id="choose-point">
                                        <IconButton><NavigateBeforeIcon /></IconButton>
                                        #PONTO1
                                        <IconButton><NavigateNextIcon /></IconButton>
                                    </div>
                                    <FormControlLabel className={classes.switch} control={
                                        <Switch 
                                            color="primary" 
                                            onChange = {handleFreeAxis} 
                                        />
                                    } label="Eixo Livre" labelPlacement="top" />
                                    <FormControlLabel className={classes.slider} control={
                                        <Slider
                                            color="primary"
                                            defaultValue={12}
                                            aria-labelledby="discrete-slider-custom"
                                            step={10}
                                            marks={marks}
                                            min={2}
                                            max={22}
                                            getAriaValueText={setDist}
                                        />
                                    } label="Deslocamento" labelPlacement="top" />
                                </div>

                                <div style={{ display: 'flex' }}>
                                    <div className="real-time-graphic">
                                        <Graph />
                                    </div>
                                    
                                    <div className="points">
                                        <button className="btn-calibration" style={{ width: '90%' }} onClick={goHome}>Home</button>
                                        <div className="joystick">
                                            <div id="z-direction"> 
                                                <Button className={classes.joystickbtns} onClick = {() => move('z',true)}>+Z<ArrowUpwardIcon /></Button>
                                                <Button className={classes.joystickbtns} onClick = {() => move('z',false)}>-Z<ArrowDownwardIcon /></Button>
                                             </div>
                                            <div id="xy-direction">
                                                <div className="horizontalbtns" id="left">
                                                    <Button className={classes.joystickbtns} onClick = {() => move("x",false)} >-X<ArrowBackIcon /></Button>
                                                </div>

                                                <div className="verticalbtns">
                                                    <Button className={classes.joystickbtns} onClick = {() => move("y",true)} >+Y<ArrowUpwardIcon /></Button>
                                                    <Button className={classes.joystickbtns} onClick = {() => move("y",false)} >-Y<ArrowDownwardIcon /></Button>
                                                </div>

                                                <div className="horizontalbtns">
                                                    <Button className={classes.joystickbtns} onClick = {() => move("x",true)} >+X<ArrowForwardIcon /></Button>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn-calibration" style={{ width: '90%' }}>Guardar Ponto</button>
                                    </div>
                                </div>
                            </div>

                            <div className="commands-interaction-container">
                                <ProgramTable />
                                <button className="btn-calibration" style={{ width: '90%' }}>Novo Comando</button>
                                <div className="btn-actions">
                                    <button className="btn-calibration" style={{ width: '45%', backgroundColor: 'rgb(4, 156, 54)' }}>Salvar</button>
                                    <button className="btn-calibration" style={{ width: '45%', backgroundColor: 'red' }}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Menu>
    );
}
