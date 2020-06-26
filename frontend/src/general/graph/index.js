import React from 'react';
import { useSelector } from 'react-redux';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import './styles.css';

import io from '../../socketio';

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

const Graph = () => {
    const classes = useStyles();
    const encoder = useSelector(state => state.configure.encoder);

    return (
        <div>

            <div className="coordinates">
                <div className="xCoord">
                    Posição X: {encoder[0]}mm
                </div>
                <div className="yCoord">
                    Posição Y: {encoder[1]}mm
                </div>
                <div className="zCoord">
                    Posição Z: {encoder[2]}mm
                </div>
            </div>
            
            <div className="graph">
                <Paper className={classes.graphposition}>
                    <div className="x">
                        <BorderLinearProgress variant="determinate" value={100 * encoder[0] / 120} axis="x" />
                    </div>
                    <div className="y">
                        <BorderLinearProgress variant="determinate" value={100 * encoder[1] / 120} axis="y" />
                    </div>
                    <div className="z">
                        <BorderLinearProgress variant="determinate" value={100 * encoder[2] / 120} axis="z" />
                    </div>
                </Paper>
            </div>
        </div>
    )
}
export default Graph;