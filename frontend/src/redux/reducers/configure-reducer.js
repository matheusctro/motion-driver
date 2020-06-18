import { loadMotions } from '../../actions'

const initialState = {
    motions: [],
    motion_select: '',
    commands: [],
    dist: 30,
    encoder: [0, 0, 0],
    openModalNewMotion: false,
    openModalNewCommand: false,
    openModalCalibration: false,
    openModalConfirmationDelete: false,
    openModalConfirmationClear:false,
    openModalAlert:false,
    openModalStatus:false,
    openModalMotorGainsConfig: false,
    status: '',
    command_select: "MOVER",
    command: "MOVER()",
    params: "",
    pos: {"x": "none", "y":"none", "z":"none"},
    indexNewCommand: 0,
    lengthCalibration: [0, 0, 0],
    nameNewMotion: '',
    
}

loadMotions();

export const ConfigureReducer = (state = initialState, action) => {
    state = Object.assign({}, state)
    switch (action.type) {
        case 'LOAD_MOTIONS':
            return {
                ...state,
                motions: action.motions
            };
        case 'ADD_MOTION':
            return {
                ...state,
                motions: action.motions
            };
        case 'SELECT_MOTION':
            return {
                ...state,
                motion_select: action.motion_select
            };
        case 'SELECT_COMMAND':
            return {
                ...state,
                command_select: action.command_select
            };
        case 'SET_COMMAND':
            return {
                ...state,
                command: action.command
            };
        case 'SET_PARAMS':
            return {
                ...state,
                params: action.params
            };
        case 'COMMANDS':
            return {
                ...state,
                commands: action.commands
            };
        case 'SET_DIST':
            return {
                ...state,
                dist: action.dist
            };
        case 'SET_ENCODER':
            return {
                ...state,
                encoder: action.encoder
            };
        case 'SET_OPEN_MODAL_MOTION':
            return {
                ...state,
                openModalNewMotion: action.openModalNewMotion
            };
        case 'SET_OPEN_MODAL_COMMAND':
            return {
                ...state,
                openModalNewCommand: action.openModalNewCommand
            };
        case 'SET_OPEN_MODAL_CALIBRATION':
            return {
                ...state,
                openModalCalibration: action.openModalCalibration
            };
        case 'SET_OPEN_MODAL_CONFIRMATION_CLEAR':
            return {
                ...state,
                openModalConfirmationClear: action.openModalConfirmationClear
            };
        case 'SET_OPEN_MODAL_CONFIRMATION_DELETE':
            return {
                ...state,
                openModalConfirmationDelete: action.openModalConfirmationDelete
            };
        case 'SET_OPEN_MODAL_ALERT':
            return {
                ...state,
                openModalAlert: action.openModalAlert
            };
        case 'SET_OPEN_MODAL_STATUS':
            return {
                ...state,
                openModalStatus: action.openModalStatus
            };
        case 'SET_STATUS':
            return {
                ...state,
                status: action.status
            };
        case 'SET_POSITION':
            return {
                ...state,
                pos: action.pos
            };
        case 'SET_CALIBRATION':
            return{
                ...state,
                lengthCalibration: action.lengthCalibration
            }
        case 'SET_INDEX_NEW_COMMAND':
            return {
                ...state,
                indexNewCommand: action.indexNewCommand
            }
        case 'SET_NAME_MOTION':
            return{
                ...state,
                nameNewMotion: action.nameNewMotion
            }
        case 'SET_OPEN_MOTOR_GAINS_CONFIG':
            return{
                ...state,
                openModalMotorGainsConfig: action.openModalMotorGainsConfig
            }

        default:
            return { ...state }
    }
}