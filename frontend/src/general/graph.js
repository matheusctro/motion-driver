import React, { useState, useEffect } from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import './graph.css';

const useStyles = makeStyles(theme => ({
    graphposition: {
        padding: theme.spacing(2),
        textAlign: 'center',
        width: '3px',
        height: '3px',
        boxShadow: 'none',
    },
}));

const BorderLinearProgress = withStyles({
    root: {
        height: 10,
        width: 'inherit',
        backgroundColor: lighten('#3656AF', 0.9),
        borderRadius: 20,
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#3656AF',
    }
})(LinearProgress);

const Graph = (props) => {
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
        <div className="graph">
            <Paper className={classes.graphposition}>
                <div className="x">
                    <BorderLinearProgress variant="determinate" value={completed} axis="x"/>
                </div>
                <div className="y">
                    <BorderLinearProgress variant="determinate" value={completed*0.5} axis="y"/>
                </div>
                <div className="z">
                    <BorderLinearProgress variant="determinate" value={completed*0.9} axis="z"/>
                </div>
            </Paper>
        </div>
    )
}
export default Graph;