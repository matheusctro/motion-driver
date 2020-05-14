import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import Graph from '../../general/graph';
import './styles.css';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

var commands = ['MOVER(10,20,0)', 'DELAY(500)', 'ACIONAR(0)', 'DELAY(100)', 'ACIONAR(1)'];

const useStyles = makeStyles((theme) => ({
    card: {
        boxShadow: 'none'
    },
    contentcard: {
        backgroundColor: "#434344",
        color: 'white',
        font: '14px Roboto',
        marginTop: '10px',
        borderRadius: 10,
        // height: '100%',
    },
    btn: {
        padding: theme.spacing(2),
        height: '100%'
        // maxWidth: '100%',
    },
    commands: {
        padding: theme.spacing(1),
        textAlign: 'center',
        height: '100%',
    },
    realtime: {
        padding: theme.spacing(1),
        textAlign: 'center',
        minWidth: '400px',
    },
}));

const Monitore = (props) => {
    const classes = useStyles();

    return (
        <Menu>
            <Topbar pageName="Monitoramento" />
            <div className="grid-container">
                <div>
                    <Paper className={classes.btn}>
                        <button className="button" type="submit">Iniciar</button>
                    </Paper>
                </div>

                <div>
                    <Paper className={classes.commands}>
                        <div>
                            <h1>Comandos</h1>
                            <Card className={classes.card}>
                                {commands.map(  (command) => (<CardContent className={classes.contentcard}>{command}</CardContent>))}
                            </Card>
                        </div>        
                    </Paper>
                </div>

                <div className="real">
                    <Paper className={classes.realtime}>
                        <div>
                            <h1>Tempo-Real</h1>
                            <Graph />
                        </div>
                    </Paper>
                </div>
            </div>
        </Menu>
    );
}

export default Monitore;