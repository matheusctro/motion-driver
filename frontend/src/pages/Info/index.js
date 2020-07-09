import React from 'react';
import Menu from '../../general/menu';
import Topbar from '../../general/topbar';
import './styles.css';
import { Paper } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

const Info = (props) => {

    const lengthCalibration = useSelector(state => state.configure.lengthCalibration);

    return (
        <Menu>
            <Topbar pageName="Informações" />
            <div className="container_info_mode_container">
                <Paper className="pageContainer">
                    <div className="text_container">

                            <p>Firmware Version: 1.2.0​<br/>

                            Software Version: 2.0.2​<br/>

                            Motor: Nema 17 KTC42HS60​<br/>

                            Driver: STR8​<br/>

                            Sensores: Indutivo NPN Festo​<br/>

                            Distância eixo X: {lengthCalibration[0]} mm​<br/>

                            Distância eixo Y: {lengthCalibration[1]} mm​<br/>

                            Distância eixo Z: {lengthCalibration[2]} mm</p>

                    </div>
                </Paper>
            </div>
        </Menu>
    );
}

export default Info;