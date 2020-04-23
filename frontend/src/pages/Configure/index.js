import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';
import { makeStyles } from '@material-ui/core/styles';

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

const programs = ['MOTION_DRIVE_ICTS_PROGRAM1', 'AUTOTESTE_PROGRAM2', 'AUTOLINE_INVENTUS_PROGRAM3', 'AUTOCOLA_FLEX_PROGRAM'];
const marks = [
    {
        value: 0,
        label: 'Curto',
    },
    {
        value: 50,
        label: 'Médio',
    },
    {
        value: 100,
        label: 'Longo',
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
    test: {
        height: '45px',
        display: 'flex',
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
        width: '50px',
        height: '50px',
        //outline: '1px solid black'
    }
}));
const Configure = (props) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        age: '',
        name: 'hai',
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <Menu>
            <Topbar pageName="Configuração" />
            <Grid container spacing={3} style={{padding: '20px'}} >
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <div className="select-container">
                            <TextField className={classes.select}
                                        variant='outlined'
                                        id="select-program"
                                        select
                                        label="Motion"
                                        >
                                {programs.map( option => (
                                    <MenuItem value={option}>
                                        {option}
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
                                    <FormControlLabel className={classes.switch} control={<Switch color="primary"/>} label="Eixo Livre" labelPlacement="top"/>
                                    <FormControlLabel className={classes.slider}control={<Slider
                                                                    color="primary"
                                                                    defaultValue={50}
                                                                    aria-labelledby="discrete-slider-custom"
                                                                    step={50}
                                                                    marks={marks}
                                                                />
                                    } label="Deslocamento" labelPlacement="top"/>
                                </div>
                                <div style= {{display: 'flex'}}>
                                    <div className="real-time-graphic">
                                    
                                    </div>
                                    <div className="joystick">
                                        <div id="z-direction">
                                            <Button className={classes.joystickbtns}><ArrowUpwardIcon /></Button>
                                            <Button className={classes.joystickbtns}><ArrowDownwardIcon /></Button>
                                        </div>
                                        <div id="xy-direction" style={{display: 'flex'}}>
                                            <Button className={classes.joystickbtns} style={{margin: '45% 50px 50px 50px'}}><ArrowForwardIcon /></Button>
                                            <Button className={classes.joystickbtns}><ArrowBackIcon /></Button>
                                            <Button className={classes.joystickbtns}><ArrowUpwardIcon /></Button>
                                            <Button className={classes.joystickbtns}><ArrowDownwardIcon /></Button>
                                        </div>
                                    </div>
                                </div>
                                
                                <button>Guardar Ponto</button>
                            </div>

                            <div className="commands-interaction-container">

                            </div>
                        </div>            
                    </Paper>
                </Grid>
            </Grid>
        </Menu>

    );
}

export default Configure;