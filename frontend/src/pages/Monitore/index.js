import React, { useState, useEffect } from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';

import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

var commands = ['MOVER(10,20,0)', 'DELAY(500)', 'ACIONAR(0)', 'DELAY(100)', 'ACIONAR(1)'];

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 270,
    },
    contentcard: {
        backgroundColor: "#3656AF",
        color: 'white',
        font: '20px Roboto',
        marginTop: '10px',
        borderRadius: 10
    },
    paper1: {
        padding: theme.spacing(2),
        maxWidth: '100%',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        paddingTop: '20px',
        width: '800px',
        height: '620px',
        position: 'absolute',
    }
}));

const BorderLinearProgress = withStyles({
    root: {
        transform: (props) => props.axis === 'x' ? 'rotate(135deg)': (props.axis === 'y' ? 'rotate(45deg)' : 'rotate(-90deg)'),
        left: (props) => props.axis === 'x' ? '322px': (props.axis === 'y' ? '320px' : '330px'),
        top: (props) => props.axis === 'x' ? '318px': (props.axis === 'y' ? '320px' : '320px'),
        position: 'absolute',
        margin: '10px 10px',
        height: 10,
        width: 250,
        backgroundColor: lighten('#3656AF', 0.9),
        borderRadius: 20,
        transformOrigin: '0 100%',
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#3656AF',
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
                            <BorderLinearProgress variant="determinate" value={completed} axis="x"/>
                            <BorderLinearProgress variant="determinate" value={completed*0.5} axis="y"/>
                            <BorderLinearProgress variant="determinate" value={completed*0.9} axis="z"/>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} >
                        <Paper className={classes.paper}>
                            <h1>Comandos</h1>
                            <Card className={classes.root}>
                                {commands.map(  (command) => (<CardContent className={classes.contentcard}>{command}</CardContent>))}
                            </Card>
                        </Paper>
                    </Grid>

                </Grid>
            </div>
        </Menu>
    );
}

export default Monitore;