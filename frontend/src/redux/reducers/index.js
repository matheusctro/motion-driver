import { combineReducers } from 'redux';
import LoginReducer from './login-reducer';
import { GeneralReducer }  from './general-reducer';

export const Reducers = combineReducers({
    general: GeneralReducer,
    login: LoginReducer
})