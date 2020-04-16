import React, { useState, useEffect } from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';

import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    paper1: {
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        paddingTop: '20px',
        position: 'absolute',
    }
}));

const BorderLinearProgressZ = withStyles({
    root: {
        position: 'absolute',
        left: '330px',
        top: '320px',
        margin: '10px',
        height: 10,
        width: 250,
        backgroundColor: lighten('#3660FE', 0.9),
        borderRadius: 20,
        transformOrigin: '0 100%',
        transform: 'rotate(-90deg)',
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#3660FE',
    }
})(LinearProgress);

const BorderLinearProgressY = withStyles({
    root: {
        position: 'absolute',
        left: '320px',
        top: '320px',
        margin: '10px',
        height: 10,
        width: 250,
        backgroundColor: lighten('#3660FE', 0.9),
        borderRadius: 20,
        transformOrigin: '0 100%',
        transform: 'rotate(45deg)',
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#3660FE',
    }
})(LinearProgress);

const BorderLinearProgressX = withStyles({
    root: {
        position: 'absolute',
        left: '322px',
        top: '318px',
        margin: '10px 10px',
        height: 10,
        width: 250,
        backgroundColor: lighten('#3660FE', 0.9),
        borderRadius: 20,
        transformOrigin: '0 100%',
        transform: 'rotate(135deg)',
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#3660FE',
    }
})(LinearProgress);

const Monitore = (props) => {
    const classes = useStyles();
    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        function progress() {
            setCompleted((oldCompleted) => {
                if(oldCompleted === 100) {
                    return 0;
                }
                const diff = Math.random()*10;
                return Math.min(oldCompleted + diff, 100);
            });
        }
        const timer = setInterval(progress, 100);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Menu>
            <Topbar pageName="Monitoramento" />
            <div className="monitoring_mode_container">
                <Grid container spacing={3} style={{padding: '20px'}}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper1}>
                            <button className="button" type="submit">Iniciar</button>
                            
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <h1>Tempo-Real</h1>
                            <BorderLinearProgressX variant="determinate" value={completed}/>
                            <BorderLinearProgressY variant="determinate" value={completed*0.5}/>
                            <BorderLinearProgressZ variant="determinate" value={completed*0.9}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} >
                        <Paper className={classes.paper}>
                            <h1>Comandos</h1>
                        </Paper>
                    </Grid>

                </Grid>
            </div>
        </Menu>
    );
}

export default Monitore;