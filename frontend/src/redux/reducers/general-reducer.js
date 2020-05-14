import { Store } from '../store';

const initialState = {
    openSidebar: false,
    page: 'Monitoramento'
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
        default:
            return { ...state }
    }
}