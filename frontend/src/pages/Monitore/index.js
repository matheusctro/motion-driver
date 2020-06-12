import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import Graph from '../../general/graph';
import './styles.css';
import handleMotion from '../Configure';
import { Paper, TextField, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FiAlertCircle } from 'react-icons/fi';
import { loadMotions } from '../../actions/index';
import api from '../../services/api';

import { makeStyles } from '@material-ui/core/styles';

//import Card from '@material-ui/core/Card';
//import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
      select: {
        height: '35px',
        width: '800px',
        marginTop: '10px',
        marginBottom: '10px',
      }
}));

const Monitore = (props) => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const motion_select = useSelector(state => state.configure.motion_select);
    const motions = useSelector(state => state.configure.motions);

    

    const handleMotion = (e) => {
          loadMotions();
          dispatch({ type: 'SELECT_MOTION', motion_select: e.target.value })
    
        if (e.target.value != '') {
          motions.map(motion => {
            if (motion.name == e.target.value) {
              dispatch({ type: 'COMMANDS', commands: motion.cmmds });
            }
          });
        }
      }
    
     const handleRunMotion = async (e)=>{
        let motion_id
        motions.map(motion => {if(motion.name == motion_select){motion_id = motion.id;}});
        await api.post(`/run?id=${motion_id}&repetition=1`); 
        console.log(motion_id);   
    }
     
     const handleStopMotion = async (e)=>{
        await api.post(`/stop`);
     }

    return (
        <Menu>
            <Topbar pageName="Monitoramento" />
            <div className="grid-container">
                <Paper>
                    <section className="form2">
                        <div className="commandList">
                            <TextField className={classes.select}
                                       variant='outlined'
                                       id="select-program"
                                       select
                                       label="Motion"
                                       value={motion_select}
                                       onChange={handleMotion}
                            >
                            {motions.map(motion => (
                                 <MenuItem key={motion.id} value={motion.name}>
                                    {motion.name}
                                </MenuItem>
                                )
                              )
                            }
                            </TextField>
                        </div>
                        <div className="real">
                            <div>
                                <h1>Tempo-Real</h1>
                                <Graph />
                            </div>
                        </div>
                    </section>
                </Paper>
                <Paper>
                    <section className="form1">
                        <div className="buttons">
                            <button className="button3" type="submit" onClick={handleRunMotion}>Iniciar</button>
                            <button className="button2" type="submit" onClick={handleStopMotion}>Parar</button>
                        </div>
                        <div className="icon">
                            <FiAlertCircle size={256} color="#cccccc" strokeWidth="1px" />
                        </div>
                    </section>
                </Paper>
            </div>
        </Menu>
    );
}

export default Monitore;