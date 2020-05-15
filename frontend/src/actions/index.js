import api from '../services/api';
import { Store } from '../redux/store';

export const loadMotions = () =>{
    api.get('/motion')
        .then(result => {
            Store.dispatch({ type: 'LOAD_MOTIONS', motions: result.data })
        })
        .catch(e => {
            console.log(e)
        })
};