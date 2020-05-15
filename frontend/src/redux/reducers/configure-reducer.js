import { Store } from '../store';
import api from '../../services/api';

import { loadMotions } from '../../actions'

const initialState = {
    motions: []
}

loadMotions();

export const ConfigureReducer = (state = initialState, action) => {
    state = Object.assign({}, state)
    switch(action.type) {
        case 'LOAD_MOTIONS':
            return { 
                ...state, 
                motions: action.motions
            };
        default:
            return { ...state }
    }
}