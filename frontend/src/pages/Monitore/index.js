import React, { useState, useEffect } from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import Graph from '../../general/graph';
import './styles.css';
import handleMotion from '../Configure';
import { Grid, Paper, TextField, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FiAlertCircle } from 'react-icons/fi';
import { loadMotions } from '../../actions/index';
import api from '../../services/api';
import AlertModal from '../../general/modal/alert';

import { makeStyles } from '@material-ui/core/styles';
import { red, green, grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        height: '100%',
        // minWidth: '1300px',
        padding: '10px',
    },
    select: {
        height: '100px',
        width: '70%',
        // marginTop: '10px',
        // marginBottom: '10px',
    },
    loop: {
        height: '100px',
        width: '30%',
        marginLeft: '5px',
        // marginTop: '10px',
        // marginBottom: '10px',
    }
}));

const Monitore = (props) => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const motion_select = useSelector(state => state.configure.motion_select);
    const motions = useSelector(state => state.configure.motions);
    const colorStatus = useSelector(state => state.general.colorStatus);
    const loopValue = useSelector(state => state.general.loopValue);
    const iconColor = useSelector(state => state.general.iconColor);


    useEffect(() => {
        let selectedColor

        switch (colorStatus) {

            case 0:
                selectedColor = '#cccccc';
                break

            case 1:
                selectedColor = 'rgb(4, 156, 54)';
                break

            case 3:
                selectedColor = 'red';
                break
        }

        console.log(selectedColor)
        dispatch({ type: 'SET_ICON_COLOR', iconColor: selectedColor });
        /*setColor(selectedColor)*/

    }, [colorStatus])

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

    const handleRunMotion = async (e) => {
        
        dispatch({ type: 'SET_LOOP_VALUE', loopValue: e.target.value });

        let motion_id
        motions.map(motion => {
            if (motion.name == motion_select) {
                motion_id = motion.id;
            }
        });

        if (motion_select != '') {
            console.log(colorStatus);
            if (loopValue <= 0 || loopValue == '') {
                await api.post(`/run?id=${motion_id}&repetition=1`);
            } else {
                await api.post(`/run?id=${motion_id}&repetition=${loopValue}`);
            }
        } else {
            dispatch({ type: 'SET_OPEN_MODAL_ALERT', openModalAlert: true });
        }


    }

    const handleStopMotion = async (e) => {

        console.log(colorStatus)
        await api.post(`/stop`);

    }

    return (
        <div>
            <Menu>
                <Topbar pageName="Monitoramento" />
                <Grid container spacing={3} style={{ padding: '20px' }} >
                    <Grid item xs={12}>
                    <div className="grid-container">
                        <Paper className={classes.paper}>
                                <section className="form1">
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

                                        <TextField className={classes.loop}
                                            variant='outlined'
                                            id="select-program"
                                            select
                                            label="Número de repetições"
                                            value={loopValue}
                                            onChange={e => dispatch({ type: 'SET_LOOP_VALUE', loopValue: e.target.value })}
                                        >
                                         
                                        <MenuItem key= {1} value= {1}> 1 </MenuItem>
                                        <MenuItem key= {2} value= {2}> 2 </MenuItem>
                                        <MenuItem key= {3} value= {3}> 3 </MenuItem>
                                        <MenuItem key= {4} value= {4}> 4 </MenuItem>
                                        <MenuItem key= {5} value= {5}> 5 </MenuItem>
                                        
                                        </TextField>
                                    </div>
                                    <div>
                                        {/* <h1>Tempo-Real</h1> */}
                                        <div className="real">
                                            <Graph />
                                        </div>
                                    </div>

                                </section>
                                </Paper>

                                <Paper className={classes.paper}>
                                <section className="form2">
                                  
                                  <div className="buttons">
                                      <button className="button-monitore" type="submit" onClick={handleRunMotion}>Iniciar</button>
                                      <button className="button-monitore" type="submit" style={{ backgroundColor: 'red' }} onClick={handleStopMotion}>Parar</button>
                                  </div>

                                  <div className="icon">
                                      <FiAlertCircle size={256} color={iconColor} strokeWidth="1px" />
                                  </div>
                              </section>
                                </Paper>

                                
                            </div>
                        
                    </Grid>
                </Grid>
            </Menu>
            <AlertModal />
        </div>
    );
}

export default Monitore;