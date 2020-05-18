import { loadMotions } from '../../actions'

const initialState = {
    motions: [],
    motion_select : '',
    commands : [{mover: "INICIO"},
                {mover_abs: {x: 40, y: 40, z: 30}},
                {acionar: 0},
                {confirma: {in: 0, nivel: "alto"}},
                {desacionar: 0}
    ],
    dist: 30
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
        case 'SELECT_MOTION':
            return { 
                ...state, 
                motion_select: action.motion_select
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
        default:
            return { ...state }
    }
}