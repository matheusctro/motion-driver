import { combineReducers } from 'redux';
import LoginReducer from './login-reducer';

export const Reducers = combineReducers({
    login: LoginReducer
})