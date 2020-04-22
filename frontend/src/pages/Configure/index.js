import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    paper:{
        height: '500px',
    },
    formControl: {
        height: '50px',
        width: '800px',
        marginTop: '1px',
        marginBottom: '1px',
    },
    test: {
        height: '45px',
        display: 'flex',
    },
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
                            <p>Motion:</p>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor="outlined-age-native-simple" style={{ outline: '1px solid red' }}>Programa</InputLabel>
                                <Select className={classes.test} native value={state.age} onChange={handleChange} label="Age" inputProps={{name: 'age', id: 'outlined-age-native-simple'}}>
                                    <option aria-label="None" value=""/>
                                    <option value={10}>programa_1_ICTS_MOTIONDRIVE</option>
                                    <option value={20}>programa_2_FLEX_AUTOTESTE</option>
                                    <option value={30}>programa_3_INVENTUS_AUTOLINE</option>
                                </Select>
                            </FormControl>
                            <div className="btns-container">
                                <IconButton><AddIcon color="secundary" /></IconButton>
                                <IconButton><ClearAllIcon color="secundary" /></IconButton>
                                <IconButton><DeleteIcon color="secundary" /></IconButton>
                                <button className="btn-calibration">Calibração</button> 
                            </div>
                        </div>

                        <div className="points-interaction-container">
                            <div className="points-config">

                            </div>

                            <div className="joystick">

                            </div>

                            <div className="real-time-graphic">
                                
                            </div>

                            <button>Guardar Ponto</button>
                        </div>

                        <div className="commands-interaction-container">

                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Menu>

    );
}

export default Configure;