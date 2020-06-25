const initialState = {
    openSidebar: false,
    page: 'Monitoramento',
    colorStatus: 0,
    loopValue: '',
    iconColor: '',
}

export const GeneralReducer = (state = initialState, action) => {
    state = Object.assign({}, state)

    switch(action.type) {
        case 'ON_OPEN_SIDEBAR':
            return { ...state, openSidebar: true };
        case 'ON_CLOSE_SIDEBAR':
            return { ...state, openSidebar: false };
        case 'ON_CHANGE_PAGE':
            return { ...state, page: action.page, openSidebar: false };
        case 'SET_COLOR_STATUS_VALUE':
            return {...state, colorStatus: action.colorStatus};
        case 'SET_LOOP_VALUE':
            return{...state, loopValue: action.loopValue};
        case 'SET_ICON_COLOR':
            return{...state, iconColor: action.iconColor};
        default:
            return { ...state }
    }
}